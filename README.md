# Ecomm

A full-stack e-commerce application built with Django REST Framework for the backend and React + Vite for the frontend. It provides a simple shopping experience with authentication, product browsing, cart management, checkout, order history, and vendor product management.

## Overview

This project combines a modern React frontend with a RESTful Django backend to create a complete online store experience. Users can sign up, browse products by category, add items to their cart, place orders, and view their order history. Vendors can manage their products through dedicated dashboard flows.

## Key Features

- User and vendor authentication
- JWT-based API authentication
- Product catalog with category-based browsing
- Product detail pages and image handling
- Shopping cart and checkout flow
- Order management and dashboard views
- Razorpay payment integration
- Responsive frontend experience

## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- Django REST Framework Simple JWT
- CORS headers
- postgresql (development)

### Frontend
- React
- Vite
- React Router DOM
- Axios
- React Toastify
- SweetAlert2

## Project Structure

```text
Backend/
  ecommerce/        # Django project settings and URLs
  accounts/          # Authentication and user accounts
  categories/        # Category models and API
  products/          # Product models and API
  cart/              # Cart operations
  orders/            # Order management
  payments/          # Payment integration
  dashboard/         # Dashboard endpoints

frontend/
  src/               # React application source
  public/            # Static assets
  package.json       # Frontend dependencies and scripts
```

## Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js 18+
- npm or yarn

## Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```
4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at:
- http://127.0.0.1:8000/

## Frontend Setup

1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will be available at:
- http://localhost:5173/

## Useful Commands

### Backend
```bash
cd Backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
```

## Notes

- The project currently uses SQLite for local development.
- Razorpay credentials are configured in the Django settings file; update them if you want to test real payments.
- Media files for products and categories are stored in the backend media directory.

## License

This project is intended for educational and development purposes.
