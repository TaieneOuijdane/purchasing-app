<?php

namespace App\Entity;

use App\Repository\ProductOrderRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductOrderRepository::class)]
#[ORM\HasLifecycleCallbacks]
class ProductOrder
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "La quantité est obligatoire")]
    #[Assert\Positive(message: "La quantité doit etre supérieure à zéro")]
    #[Groups(['order:read', 'order:write'])]
    private ?int $quantity = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['order:read'])]
    private ?string $unitPrice = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['order:read'])]
    private ?string $totalPrice = null;

    #[ORM\ManyToOne(inversedBy: 'productOrders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $purchaseOrder = null;

    #[ORM\ManyToOne(inversedBy: 'productOrders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: "Le produit est obligatoire")]
    #[Groups(['order:read', 'order:write'])]
    private ?Product $product = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getUnitPrice(): ?string
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(string $unitPrice): static
    {
        $this->unitPrice = $unitPrice;

        return $this;
    }

    public function getTotalPrice(): ?string
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(string $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getPurchaseOrder(): ?Order
    {
        return $this->purchaseOrder;
    }

    public function setPurchaseOrder(?Order $purchaseOrder): static
    {
        $this->purchaseOrder = $purchaseOrder;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function calculatePrices(): void
    {
        if ($this->product) {
            $this->unitPrice = $this->product->getPrice();
            $this->totalPrice = (string) ((float) $this->unitPrice * $this->quantity);
        }
    }
}