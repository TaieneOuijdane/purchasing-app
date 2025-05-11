# Coding Challenge – Purchasing App

A comprehensive purchasing management application built with modern technologies, featuring authentication, products and users management, and order processing capabilities.

## Tech Stack

### Frontend
- **React 19.1** with TypeScript
- **Vite** for fast development and builds
- **TailwindCSS** for styling
- **Headless UI** components for accessibility and composition
- **React Hook Form** for form management
- **Axios** for API communication

### Backend
- **Symfony 7.2** with PHP 8.2
- **API Platform** for RESTful API development
- **PostgreSQL 16.8** database
- **Doctrine ORM** for database management
- **JWT Authentication** for secure API access

### DevOps
- **Docker** multi-container setup
- **Docker Compose** for orchestration
- **Alpine-based images** for smaller container sizes

## Project Structure

purchasing-app/
├── purchasing-backend/          # Symfony API
│   ├── src/
│   │   ├── ApiResource/              # API Platform resource configurations
│   │   ├── Controller/               # HTTP controllers for custom endpoints
│   │   ├── DataFixtures/             # Sample data
│   │   ├── Entity/                   # Database entities
│   │   ├── Repository/               # Data access layer and custom queries
│   │   ├── Security/                 # Authentication/authorization logic
│   │   └── State/                    # API Platform state processors
│   ├── config/                       # Symfony configuration
│   ├── public/                       # Web server document root
│   ├── DockerFile/                   # Docker container configuration for backend
│   └── migrations/                   # Database migrations
│
├── purchasing-frontend/         # React application
│   ├── src/
│   │   ├── assets/             # assests
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React context providers 
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Helper functions
│   ├── DockerFile/             # Docker container configuration for frontend
│   └── public/                 # Static assets by Vite
│
├── docker-compose.yml          # Multi-container Docker configuration
└── README.md                   # Project documentation

## Features

### Authentication & Authorization
- Email/password login
- JWT token-based authentication
- Role-based access control (admin/user)
- Protected routes and API endpoints

### User Management
- User CRUD operations
- Role assignment (admin/user)
- User profile

### Product Management
- Product CRUD operations (Create, Read, Update, Delete)
- Product categories management
- Interactive product and category datatable with pagination
- Category CRUD operations
- Product-category associations

### Purchase Order Management
- Create orders with multiple products
- Quantity and price calculations
- Order status tracking (pending, approved, rejected, completed)
- Order history and management
- Customer-specific order views

## Frontend Architecture

### What You Can Do

**Login and Security**
- Sign in with your email and password
- Different access levels for regular users and admins
- Secure pages and data protection

**Manage Users**
- Add, edit, and remove users
- Assign admin or regular user roles
- View personal profile information

**Handle Products and Categories**
- Add, view, edit, and delete products
- Create and manage product categories
- Organize products by category
- View products in a datatable
- Navigate through pages of products
- Categories with associated products cannot be deleted (protected from accidental removal)

**Process Orders**
- Create orders with multiple items
- Automatically calculate totals
- Track order status (waiting, approved, rejected, done)
- View past orders
- See only your own orders as a customer for regular user

## Backend Architecture

### API Design
- RESTful API following REST principles
- API Platform for automatic OpenAPI documentation
- Custom state processors for business logic
- Comprehensive error handling

### Database Design
- Normalized PostgreSQL schema
- Doctrine ORM for object mapping
- Database migrations for version control

### Security Features
- Password hashing with modern algorithms
- JWT tokens for stateless authentication
- CORS configuration for frontend integration

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
  git clone https://github.com/TaieneOuijdane/purchasing-app.git
  cd purchasing-app

2. **Start the application**
  docker-compose up -d

3. **Install dependencies**
  docker-compose exec php composer install

4. **Setup JWT keys**
  Generate JWT keypair for authentication
  docker-compose exec php php bin/console lexik:jwt:generate-keypair

5. **Setup the database**
  # Run migrations
  docker-compose exec php php bin/console doctrine:migrations:migrate

  # Load sample data (optional)
  docker-compose exec php php bin/console doctrine:fixtures:load

6. **Access the application**
  - Frontend: http://localhost:5173
  - API: http://localhost:8000
  - Database Admin: http://localhost:8080

### DataFixtures Credentials

**Admin User:**
- Email: admin@demo.com
- Password: AdminP@ssword123

**Regular User:**
- Email: user@demo.com
- Password: password123

## Development

### Frontend Development

# Install dependencies
cd purchasing-frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

### Backend Development

# Install dependencies
cd purchasing-backend
composer install

# Run migrations
php bin/console doctrine:migrations:migrate

# Clear cache
php bin/console cache:clear

## 🔍 Key Components
### Frontend Components
- LoginForm - Sign-in interface
- Layout - Main page structure with navigation
- DataTable - Interactive tables for products, orders, and users

### Backend Entities
- `User`: Authentication and authorization
- `Product`: Product catalog management
- `Order`: Purchase order processing
- `ProductOrder`: Order line items
- `Category`: Product categorization

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend .env:**

JWT_SECRET_KEY=/app/config/jwt/private.pem
JWT_PUBLIC_KEY=/app/config/jwt/public.pem
JWT_PASSPHRASE=your-passphrase-here
CORS_ALLOW_ORIGIN='^https?://(localhost|127.0.0.1)(:(5173|3000|8080))?$'
APP_SECRET=your-app-secret-here

**Frontend .env:**

VITE_API_URL=http://localhost:8000/api

## Future Improvements

### Data Management
- **Soft Delete**: Use `isActive` to hide items instead of permanent deletion
- **Advanced Filtering**: Search and filter all data tables
- **Bulk Actions**: Select multiple items for quick editing

### User Experience
- **Profile Settings**: Update password and personal details
- **Dashboard Stats**: View order summaries and trends
- **Notifications**: Get alerts for status changes

### Workflow
- **Data Export**: Download reports in Excel/PDF
- **Custom Roles**: Create specialized user permissions

### Performance
- **Faster Loading**: Improve page speed