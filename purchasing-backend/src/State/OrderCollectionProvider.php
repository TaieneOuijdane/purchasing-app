<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\OrderRepository;
use Symfony\Bundle\SecurityBundle\Security;

final class OrderCollectionProvider implements ProviderInterface
{
    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly Security $security,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        // If no user is authenticated
        if (!$user) {
            return [];
        }
        
        // If user is admin, return all orders
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return $this->orderRepository->findAll();
        }
        
        // Otherwise, return only user's orders
        return $this->orderRepository->findBy(['customer' => $user]);
    }
}