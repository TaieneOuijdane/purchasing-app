<?php

namespace App\Controller\Auth;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class ApiAuthController extends AbstractController
{
    #[Route('/api/authenticated', name: 'api_authenticated', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function __invoke(UserInterface $user): JsonResponse
    {
        return $this->json($user, 200, [], ['groups' => ['user:read']]);
    }
}
