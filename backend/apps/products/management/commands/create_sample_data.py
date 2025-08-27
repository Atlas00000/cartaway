from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Create sample categories and products for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Get or create a user for product creation
        user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        # Create categories
        categories_data = [
            {
                'name': 'Electronics',
                'slug': 'electronics',
                'description': 'Latest electronic gadgets and devices'
            },
            {
                'name': 'Clothing',
                'slug': 'clothing',
                'description': 'Fashion and apparel for all ages'
            },
            {
                'name': 'Books',
                'slug': 'books',
                'description': 'Books across all genres'
            },
            {
                'name': 'Home & Garden',
                'slug': 'home-garden',
                'description': 'Everything for your home and garden'
            },
            {
                'name': 'Sports',
                'slug': 'sports',
                'description': 'Sports equipment and accessories'
            }
        ]
        
        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Create products
        products_data = [
            # Electronics
            {
                'name': 'iPhone 15 Pro',
                'slug': 'iphone-15-pro',
                'description': 'Latest iPhone with advanced camera system and A17 Pro chip',
                'short_description': 'Premium smartphone with cutting-edge features',
                'price': Decimal('999.99'),
                'compare_price': Decimal('1099.99'),
                'category': categories[0],
                'stock_quantity': 50,
                'is_featured': True,
                'is_bestseller': True
            },
            {
                'name': 'MacBook Air M2',
                'slug': 'macbook-air-m2',
                'description': 'Ultra-thin laptop with M2 chip for incredible performance',
                'short_description': 'Lightweight laptop with powerful M2 processor',
                'price': Decimal('1199.99'),
                'compare_price': Decimal('1299.99'),
                'category': categories[0],
                'stock_quantity': 25,
                'is_featured': True
            },
            {
                'name': 'Sony WH-1000XM5',
                'slug': 'sony-wh-1000xm5',
                'description': 'Industry-leading noise canceling wireless headphones',
                'short_description': 'Premium noise-canceling headphones',
                'price': Decimal('349.99'),
                'category': categories[0],
                'stock_quantity': 100,
                'is_bestseller': True
            },
            
            # Clothing
            {
                'name': 'Nike Air Max 270',
                'slug': 'nike-air-max-270',
                'description': 'Comfortable running shoes with Air Max technology',
                'short_description': 'Comfortable and stylish running shoes',
                'price': Decimal('129.99'),
                'compare_price': Decimal('149.99'),
                'category': categories[1],
                'stock_quantity': 75,
                'is_featured': True
            },
            {
                'name': 'Levi\'s 501 Original Jeans',
                'slug': 'levis-501-original-jeans',
                'description': 'Classic straight-fit jeans with timeless style',
                'short_description': 'Classic straight-fit denim jeans',
                'price': Decimal('89.99'),
                'category': categories[1],
                'stock_quantity': 200,
                'is_bestseller': True
            },
            
            # Books
            {
                'name': 'The Great Gatsby',
                'slug': 'the-great-gatsby',
                'description': 'F. Scott Fitzgerald\'s masterpiece about the American Dream',
                'short_description': 'Classic American literature',
                'price': Decimal('12.99'),
                'category': categories[2],
                'stock_quantity': 150,
                'is_featured': True
            },
            {
                'name': 'To Kill a Mockingbird',
                'slug': 'to-kill-a-mockingbird',
                'description': 'Harper Lee\'s Pulitzer Prize-winning novel',
                'short_description': 'Timeless story of justice and racism',
                'price': Decimal('14.99'),
                'category': categories[2],
                'stock_quantity': 120,
                'is_bestseller': True
            },
            
            # Home & Garden
            {
                'name': 'Philips Hue Smart Bulb Starter Kit',
                'slug': 'philips-hue-starter-kit',
                'description': 'Smart lighting system with voice control and automation',
                'short_description': 'Smart home lighting system',
                'price': Decimal('199.99'),
                'compare_price': Decimal('249.99'),
                'category': categories[3],
                'stock_quantity': 30,
                'is_featured': True
            },
            {
                'name': 'KitchenAid Stand Mixer',
                'slug': 'kitchenaid-stand-mixer',
                'description': 'Professional-grade stand mixer for all your baking needs',
                'short_description': 'Professional stand mixer for baking',
                'price': Decimal('379.99'),
                'category': categories[3],
                'stock_quantity': 20,
                'is_bestseller': True
            },
            
            # Sports
            {
                'name': 'Wilson Pro Staff Tennis Racket',
                'slug': 'wilson-pro-staff-tennis-racket',
                'description': 'Professional tennis racket used by top players',
                'short_description': 'Professional tennis racket',
                'price': Decimal('249.99'),
                'category': categories[4],
                'stock_quantity': 40,
                'is_featured': True
            },
            {
                'name': 'Adidas Predator Soccer Cleats',
                'slug': 'adidas-predator-soccer-cleats',
                'description': 'High-performance soccer cleats with advanced technology',
                'short_description': 'Professional soccer cleats',
                'price': Decimal('179.99'),
                'compare_price': Decimal('199.99'),
                'category': categories[4],
                'stock_quantity': 60,
                'is_bestseller': True
            }
        ]
        
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    **product_data,
                    'created_by': user
                }
            )
            if created:
                self.stdout.write(f'Created product: {product.name}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
