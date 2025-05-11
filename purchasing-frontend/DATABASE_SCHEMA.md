# Database Schema

## Entities Overview

### User
- id: integer
- email: string (unique)
- roles: array
- password: string (hashed)
- firstName: string
- lastName: string
- isActive: boolean
- createdAt: datetime
- updatedAt: datetime
- deletedAt: datetime

### Product
- id: integer
- name: string
- description: text
- price: decimal
- sku: string (unique)
- stock: integer
- image: string
- isActive: boolean
- category: Category (ManyToOne)
- createdAt: datetime
- updatedAt: datetime
- deletedAt: datetime

### Category
- id: integer
- name: string
- description: text
- products: Product[] (OneToMany)
- createdAt: datetime
- updatedAt: datetime
- deletedAt: datetime

### Order
- id: integer
- orderNumber: string (unique)
- orderDate: datetime
- status: string (enum)
- totalAmount: decimal
- notes: text
- createdAt: datetime
- updatedAt: datetime
- deletedAt: datetime
- customer: User (ManyToOne)
- productOrders: ProductOrder[] (OneToMany)
- isActive: boolean

### ProductOrder
- id: integer
- quantity: integer
- unitPrice: decimal
- totalPrice: decimal
- product: Product (ManyToOne)
- purchaseOrder: Order (ManyToOne)