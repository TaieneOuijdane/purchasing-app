<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Put;
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
        // For PUT operations, we need to load the existing order
        if ($operation instanceof Put && isset($uriVariables['id'])) {
            $orderId = (int) $uriVariables['id'];
            
            $existingOrder = $this->entityManager->getRepository(Order::class)->find($orderId);
            
            if (!$existingOrder) {
                throw new \RuntimeException("Order with ID {$orderId} not found");
            }
            
            $data = $existingOrder;
        }

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
                $this->entityManager->remove($productOrder);
            }
                        
            // Add new product orders
            foreach ($requestData['productOrders'] as $index => $productOrderData) {
                
                if (!isset($productOrderData['product'])) {
                    continue;
                }
                
                $productIri = $productOrderData['product'];
                $productId = (int) filter_var($productIri, FILTER_SANITIZE_NUMBER_INT);
                $product = $this->entityManager->getRepository(Product::class)->find($productId);
                                
                if (!$product) {
                    continue;
                }
                
                // Create new product order
                $productOrder = new ProductOrder();
                $productOrder->setProduct($product);
                $productOrder->setQuantity($productOrderData['quantity'] ?? 1);
                $productOrder->setPurchaseOrder($data);
                $productOrder->calculatePrices();
                
                $data->addProductOrder($productOrder);
                $this->entityManager->persist($productOrder);
                
            }
        }

        // Update other fields
        if (isset($requestData['status'])) {
            $data->setStatus($requestData['status']);
        }
        error_log('having the status  ' . $requestData['status']);
        
        if (isset($requestData['notes'])) {
            $data->setNotes($requestData['notes']);
        }

        // Calculate total
        $data->calculateTotalAmount();

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}