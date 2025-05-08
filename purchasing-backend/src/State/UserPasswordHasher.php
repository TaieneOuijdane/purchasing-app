<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserPasswordHasher implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $processor,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof User && $data->getPassword()) {
            $hashedPassword = $this->passwordHasher->hashPassword(
                $data,
                $data->getPassword()
            );
            $data->setPassword($hashedPassword);
            
            // Set timestamps
            if (!isset($context['previous_data'])) {
                // New user
                $data->setCreatedAt(new \DateTimeImmutable());
                
                // Set isActive to true by default if not specified
                if ($data->isActive() === null) {
                    $data->setIsActive(true);
                }
            } else {
                // Update
                $data->setUpdatedAt(new \DateTimeImmutable());
            }
        }

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}