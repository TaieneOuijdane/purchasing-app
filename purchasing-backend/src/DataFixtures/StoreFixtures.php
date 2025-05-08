<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class StoreFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Create categories
        $categories = [];
        $categoryNames = ['Tisane', 'Complément', 'Epice', 'Alimentaire'];
        
        foreach ($categoryNames as $index => $name) {
            $category = new Category();
            $category->setName($name);
            $category->setDescription("Description de la catégorie $name");
            $category->setCreatedAt(new \DateTimeImmutable());
            $manager->persist($category);
            $categories[] = $category;
        }

        // Create product for each category
        foreach ($categories as $category) {
            for ($i = 1; $i <= 5; $i++) {
                $product = new Product();
                $product->setName($category->getName() . " produit $i");
                $product->setDescription("Description du produit $i avec la catégorie " . $category->getName());
                $product->setPrice((100 + $i * 10) . '.99');
                $product->setSku(strtoupper(substr($category->getName(), 0, 3)) . '-' . str_pad($i, 3, '0', STR_PAD_LEFT));
                $product->setStock(mt_rand(5, 100));
                $product->setIsActive(true);
                $product->setCategory($category);
                $product->setCreatedAt(new \DateTimeImmutable());
                $manager->persist($product);
            }
        }

        $manager->flush();
    }
}