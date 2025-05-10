<?php
// src/State/OrderStateProcessor.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Order;
use App\Entity\ProductOrder;
use App\Entity\Product;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;

final class OrderStateProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly Security $security,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Order) {
            return $data;
        }

        if (!$data->getCustomer()) {
            $data->setCustomer($this->security->getUser());
        }

        $requestData = $context['request']?->getContent();
        $requestData = json_decode($requestData, true);
        
        if (isset($requestData['productOrders']) && is_array($requestData['productOrders'])) {
            // Clear existing product orders
            foreach ($data->getProductOrders() as $productOrder) {
                $data->removeProductOrder($productOrder);
            }
            
            // Add new product orders
            foreach ($requestData['productOrders'] as $productOrderData) {
                $productOrder = new ProductOrder();
                
                if (isset($productOrderData['product'])) {
                    $productIri = $productOrderData['product'];
                    $productId = (int) filter_var($productIri, FILTER_SANITIZE_NUMBER_INT);
                    $product = $this->entityManager->getRepository(Product::class)->find($productId);
                    
                    if ($product) {
                        $productOrder->setProduct($product);
                        $productOrder->setQuantity($productOrderData['quantity'] ?? 1);
                        $productOrder->setPurchaseOrder($data);
                        
                        $data->addProductOrder($productOrder);
                    }
                }
            }
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}