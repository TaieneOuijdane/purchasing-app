<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\State\OrderStateProcessor;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(
            security: "is_granted('ROLE_USER')",
            securityMessage: "Seuls les utilisateurs connectés peuvent voir les commandes"
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN') or object.getCustomer() == user",
            securityMessage: "Vous ne pouvez voir que vos propres commandes"
        ),
        new Post(
            security: "is_granted('ROLE_USER')",
            securityMessage: "Vous devez etre connecté pour créer une commande",
            processor: OrderStateProcessor::class
        ),
        new Put(
            security: "is_granted('ROLE_ADMIN') or (object.getCustomer() == user and object.getStatus() == 'pending')",
            securityMessage: "Vous ne pouvez modifier que vos commandes en attente"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: "Seuls les administrateurs peuvent supprimer des commandes"
        )
    ],
    normalizationContext: ['groups' => ['order:read']],
    denormalizationContext: ['groups' => ['order:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'orderNumber' => 'exact',
    'status' => 'exact',
    'customer.email' => 'partial'
])]
#[ApiFilter(DateFilter::class, properties: ['orderDate'])]
#[ApiFilter(OrderFilter::class, properties: ['orderDate', 'totalAmount'], arguments: ['orderParameterName' => 'order'])]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['order:read'])]
    private ?string $orderNumber = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['order:read', 'order:write'])]
    private ?\DateTimeImmutable $orderDate = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: "Le statut est obligatoire")]
    #[Assert\Choice(choices: ["pending", "approved", "rejected", "completed"], message: "Le statut doit être l'un des suivants : pending, approved, rejected, completed")]
    #[Groups(['order:read', 'order:write'])]
    private ?string $status = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['order:read'])]
    private ?string $totalAmount = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    private ?string $notes = null;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['order:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['order:read'])]
    private ?\DateTimeImmutable $deletedAt = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['order:read', 'order:write'])]
    private ?User $customer = null;

    #[ORM\Column]
    #[Groups(['order:read', 'order:write'])]
    private ?bool $isActive = null;

    /**
     * @var Collection<int, ProductOrder>
     */
    #[ORM\OneToMany(targetEntity: ProductOrder::class, mappedBy: 'purchaseOrder', orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: "Une commande doit contenir au moins un produit")]
    private Collection $productOrders;

    public function __construct()
    {
        $this->productOrders = new ArrayCollection();
        $this->status = "pending";
        $this->orderDate = new \DateTimeImmutable();
        $this->totalAmount = "0.00";
        $this->isActive = true;
    }
    
    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->orderNumber = 'ORD-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT) . '-' . time();
        $this->calculateTotalAmount();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
        $this->calculateTotalAmount();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrderNumber(): ?string
    {
        return $this->orderNumber;
    }

    public function setOrderNumber(string $orderNumber): static
    {
        $this->orderNumber = $orderNumber;

        return $this;
    }

    public function getOrderDate(): ?\DateTimeImmutable
    {
        return $this->orderDate;
    }

    public function setOrderDate(\DateTimeImmutable $orderDate): static
    {
        $this->orderDate = $orderDate;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getTotalAmount(): ?string
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(string $totalAmount): static
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeImmutable $deletedAt): static
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function getCustomer(): ?User
    {
        return $this->customer;
    }

    public function setCustomer(?User $customer): static
    {
        $this->customer = $customer;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * @return Collection<int, ProductOrder>
     */
    public function getProductOrders(): Collection
    {
        return $this->productOrders;
    }

    public function addProductOrder(ProductOrder $productOrder): static
    {
        if (!$this->productOrders->contains($productOrder)) {
            $this->productOrders->add($productOrder);
            $productOrder->setPurchaseOrder($this);
        }

        return $this;
    }

    public function removeProductOrder(ProductOrder $productOrder): static
    {
        if ($this->productOrders->removeElement($productOrder)) {
            // set the owning side to null (unless already changed)
            if ($productOrder->getPurchaseOrder() === $this) {
                $productOrder->setPurchaseOrder(null);
            }
        }

        return $this;
    }

    public function calculateTotalAmount(): void
    {
        $total = 0;
        
        foreach ($this->productOrders as $item) {
            $total += (float) $item->getTotalPrice();
        }
        
        $this->totalAmount = (string) $total;
    }
}