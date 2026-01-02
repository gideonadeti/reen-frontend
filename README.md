# REEN Frontend

A modern, responsive web application for a scalable e-commerce platform. Built with Next.js and featuring a beautiful UI with dark mode support, real-time updates, and comprehensive e-commerce functionality. This frontend client communicates with the [REEN Backend API](https://github.com/gideonadeti/reen-backend) to provide a complete e-commerce experience with product management, shopping cart, checkout processing, and order management.

## Table of Contents

- [REEN Frontend](#reen-frontend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Authentication \& Authorization](#authentication--authorization)
    - [Product Management](#product-management)
    - [Shopping Cart](#shopping-cart)
    - [Checkout \& Payments](#checkout--payments)
    - [Order Management](#order-management)
    - [User Management](#user-management)
    - [User Experience](#user-experience)
  - [Screenshots](#screenshots)
  - [Technologies Used](#technologies-used)
    - [Core Framework](#core-framework)
    - [State Management \& Data Fetching](#state-management--data-fetching)
    - [UI Components \& Styling](#ui-components--styling)
    - [Forms \& Validation](#forms--validation)
    - [HTTP Client](#http-client)
    - [Authentication](#authentication)
    - [Analytics](#analytics)
    - [Development Tools](#development-tools)
  - [Running Locally](#running-locally)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation Steps](#installation-steps)
  - [Deployment](#deployment)
    - [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
  - [Contributing](#contributing)
    - [Development Guidelines](#development-guidelines)
  - [Support](#support)
  - [Acknowledgements](#acknowledgements)

## Features

### Authentication & Authorization

- **Clerk Integration** - Primary authentication method using Clerk for modern user management
- **User Registration & Login** - Secure user authentication with Clerk
- **Persistent Sessions** - Automatic session management for seamless user experience
- **User Roles** - Support for Admin, Non-Admin, and Anonymous user roles
- **Protected Routes** - Secure page access with authentication guards
- **Role-Based UI** - Different UI elements and features based on user roles

### Product Management

- **Product Catalog** - Browse all available products with detailed information
- **Product CRUD Operations** - Create, read, update, and delete products (for admins)
- **Product Search & Filtering** - Advanced filtering by name, price range, and quantity
- **Pagination Support** - Efficient pagination for large product catalogs
- **Product Images** - Support for multiple image URLs per product
- **My Products View** - Admins can view and manage their own products
- **Product Details** - Detailed product information with images and specifications
- **Inventory Display** - Real-time inventory quantity display

### Shopping Cart

- **Cart Item Management** - Add, update, and remove items from shopping cart
- **Quantity Management** - Update item quantities with validation
- **Cart Sheet** - Slide-out cart panel for easy access
- **Real-Time Cart Updates** - Optimistic UI updates for better UX
- **Cart Validation** - Ensures quantities don't exceed available inventory
- **Cart Persistence** - Cart items persist across sessions

### Checkout & Payments

- **Stripe Integration** - Secure payment processing through Stripe Checkout
- **Checkout Dialog** - User-friendly checkout flow with test card information
- **Payment Session Creation** - Generate secure checkout sessions for cart items
- **Payment Redirect** - Seamless redirect to Stripe Checkout page
- **Payment Status Handling** - Handle successful and canceled payment flows
- **Test Mode Support** - Test card numbers for development and testing

### Order Management

- **Order History** - View all past orders with detailed information
- **Order Details** - Comprehensive order information including products, quantities, and prices
- **Order Status Tracking** - Track order status and completion
- **Order Filtering** - Filter and search through order history
- **Admin Order View** - Admins can view orders for their products

### User Management

- **User Profile** - View and manage user profile information
- **Financial Dashboard** - Track balance, sales count, purchases count, amount gained, and amount spent
- **User Statistics** - Visual representation of user financial metrics
- **User List** - View all users in the system (for admins)
- **User Role Management** - Admins can update user roles
- **User Details** - Detailed user information and statistics

### User Experience

- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Loading States** - Smooth loading indicators and skeletons
- **Error Handling** - User-friendly error messages and toast notifications
- **Toast Notifications** - Beautiful notification system for user feedback
- **Optimistic Updates** - Instant UI updates for better UX
- **Sidebar Navigation** - Intuitive navigation with badge counters
- **Data Tables** - Advanced data tables with sorting, filtering, and pagination

## Screenshots

For screenshots, please visit the [REEN Frontend repository](https://github.com/gideonadeti/reen-frontend#screenshots).

## Technologies Used

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development

### State Management & Data Fetching

- **TanStack Query** - Powerful data synchronization and caching
- **TanStack Query Devtools** - Development tools for debugging queries
- **TanStack Table** - Headless UI for building powerful tables

### UI Components & Styling

- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown Menu, Label, Popover, Scroll Area, Select, Separator, Slot, Tooltip
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme switching (dark mode)
- **class-variance-authority** - Component variant management
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind CSS classes

### Forms & Validation

- **React Hook Form** - Performant forms with easy validation
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod resolver for React Hook Form

### HTTP Client

- **Axios** - Promise-based HTTP client with interceptors

### Authentication

- **Clerk** - Modern authentication and user management service

### Analytics

- **Vercel Analytics** - Web analytics and performance monitoring

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Turbopack** - Fast bundler for development

## Running Locally

### Prerequisites

- Node.js (v22 or higher)
- npm package manager (or alternatives like yarn, pnpm, or bun)
- Backend API running (see [REEN Backend](https://github.com/gideonadeti/reen-backend))

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"

# Backend API
NEXT_PUBLIC_BACKEND_BASE_URL="http://**localhost**"
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/gideonadeti/reen-frontend.git
   cd reen-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   **Note:** You can use alternative package managers like yarn, pnpm, or bun if preferred.

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

## Deployment

### Vercel Deployment (Recommended)

1. **Push your code to GitHub**

   ```bash
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository from GitHub

3. **Configure environment variables**
   - Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` environment variable
   - Add `CLERK_SECRET_KEY` environment variable
   - Add `NEXT_PUBLIC_BACKEND_BASE_URL` environment variable pointing to your production backend API

4. **Deploy**
   - Click on Deploy
   - Vercel will automatically deploy on every push to the main branch

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and use ESLint for linting
- Use TypeScript for all new files
- Ensure responsive design works on all screen sizes
- Test dark mode compatibility
- Write meaningful component and function names
- Keep components focused and reusable
- Use TanStack Query for all data fetching
- Follow React best practices and hooks patterns

## Support

If you find this project helpful or interesting, consider supporting me:

[☕ Buy me a coffee](https://buymeacoffee.com/gideonadeti)

## Acknowledgements

This project is inspired by the [roadmap.sh Scalable E-Commerce Platform](https://roadmap.sh/projects/scalable-ecommerce-platform) project challenge. The frontend implementation provides a modern, user-friendly interface for the e-commerce platform, following best practices for React and Next.js development.

Thanks to these technologies:

- [Next.js](https://nextjs.org/) - The React framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- [Clerk](https://clerk.com/) - Authentication and user management
- [Lucide](https://lucide.dev/) - Beautiful icon library
- [Vercel](https://vercel.com/) - Deployment platform
