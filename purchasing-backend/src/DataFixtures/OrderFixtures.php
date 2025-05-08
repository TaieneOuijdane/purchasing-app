<?php

namespace App\DataFixtures;

use App\Entity\Order;
use App\Entity\ProductOrder;
use App\Entity\User;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class OrderFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // get a user
        $user = $manager->getRepository(User::class)->findOneBy([]);
        
        // get some products
        $products = $manager->getRepository(Product::class)->findBy([], null, 5);
        
        // Statuts for orders
        $statuses = ["pending", "approved", "completed"];
        
        // Create 3 orders
        for ($i = 0; $i < 3; $i++) {
            $order = new Order();
            $order->setCustomer($user);
            $order->setOrderDate(new \DateTimeImmutable());
            $order->setStatus($statuses[$i]);
            $order->setNotes('Commande numéro ' . ($i + 1));
            $order->setIsActive(true);
            
            // Add products to order
            for ($j = 0; $j < 2; $j++) {
                $productOrder = new ProductOrder();
                $productOrder->setProduct($products[$j]);
                $productOrder->setQuantity($j + 1);
                $order->addProductOrder($productOrder);
            }
            
            $manager->persist($order);
        }
        
        $manager->flush();
    }
    
    public function getDependencies(): array
    {
        return [
            AdminUserFixtures::class,
            StoreFixtures::class
        ];
    }
}