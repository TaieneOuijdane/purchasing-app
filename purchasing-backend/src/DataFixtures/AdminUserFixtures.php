<?php
namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminUserFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        // 1. Create a new user admin
        $admin = new User();
        $admin->setEmail('admin@demo.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setFirstName('Super');
        $admin->setLastName('Admin');
        $admin->setCreatedAt(new \DateTimeImmutable());
        $admin->setIsActive(true);
        $admin->setPassword(
            $this->hasher->hashPassword($admin, 'AdminP@ssword123')
        );

        $manager->persist($admin);

        // Create a regular user
        $user = new User();
        $user->setEmail('user@demo.com');
        $user->setRoles(['ROLE_USER']);
        $user->setFirstName('Regular');
        $user->setLastName('User');
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setIsActive(true);
        $user->setPassword(
            $this->hasher->hashPassword($user, 'password123')
        );
        $manager->persist($user);

        $manager->flush();
    }
}