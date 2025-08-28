from django.core.management.base import BaseCommand
from apps.products.models import Category, Product
from apps.users.models import User
from apps.orders.models import ShippingMethod, TaxRate
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Seed database with sample data for integration testing'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding database with sample data...\n')
        
        # Get or create admin user
        admin_user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('✅ Created admin user')
        else:
            self.stdout.write('✅ Admin user already exists')

        # Create categories
        categories_data = [
            {
                'name': 'Electronics',
                'slug': 'electronics',
                'description': 'Latest gadgets and electronic devices',
                'is_active': True
            },
            {
                'name': 'Fashion',
                'slug': 'fashion',
                'description': 'Trendy clothing and accessories',
                'is_active': True
            },
            {
                'name': 'Home & Garden',
                'slug': 'home-garden',
                'description': 'Everything for your home and garden',
                'is_active': True
            },
            {
                'name': 'Sports & Outdoors',
                'slug': 'sports-outdoors',
                'description': 'Sports equipment and outdoor gear',
                'is_active': True
            },
            {
                'name': 'Books & Media',
                'slug': 'books-media',
                'description': 'Books, movies, and digital media',
                'is_active': True
            }
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(f'✅ Created category: {category.name}')

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
                'category': categories['electronics'],
                'stock_quantity': 50,
                'is_featured': True,
                'is_bestseller': True,
                'sku': 'IPH15PRO-128'
            },
            {
                'name': 'MacBook Air M2',
                'slug': 'macbook-air-m2',
                'description': 'Ultra-thin laptop with M2 chip for incredible performance',
                'short_description': 'Lightweight laptop with all-day battery life',
                'price': Decimal('1199.99'),
                'compare_price': Decimal('1299.99'),
                'category': categories['electronics'],
                'stock_quantity': 30,
                'is_featured': True,
                'is_bestseller': True,
                'sku': 'MBA-M2-256'
            },
            {
                'name': 'Sony WH-1000XM5',
                'slug': 'sony-wh-1000xm5',
                'description': 'Premium noise-canceling headphones with exceptional sound quality',
                'short_description': 'Industry-leading noise cancellation',
                'price': Decimal('349.99'),
                'compare_price': Decimal('399.99'),
                'category': categories['electronics'],
                'stock_quantity': 75,
                'is_featured': False,
                'is_bestseller': True,
                'sku': 'SONY-WH1000XM5'
            },
            # Fashion
            {
                'name': 'Nike Air Max 270',
                'slug': 'nike-air-max-270',
                'description': 'Comfortable running shoes with Air Max technology',
                'short_description': 'Maximum comfort for your daily runs',
                'price': Decimal('129.99'),
                'compare_price': Decimal('149.99'),
                'category': categories['fashion'],
                'stock_quantity': 100,
                'is_featured': True,
                'is_bestseller': False,
                'sku': 'NIKE-AM270'
            },
            {
                'name': 'Levi\'s 501 Original Jeans',
                'slug': 'levis-501-original',
                'description': 'Classic straight-fit jeans with timeless style',
                'short_description': 'The original blue jeans',
                'price': Decimal('79.99'),
                'compare_price': Decimal('89.99'),
                'category': categories['fashion'],
                'stock_quantity': 200,
                'is_featured': False,
                'is_bestseller': True,
                'sku': 'LEVIS-501-32'
            },
            # Home & Garden
            {
                'name': 'Dyson V15 Detect',
                'slug': 'dyson-v15-detect',
                'description': 'Cordless vacuum with laser dust detection',
                'short_description': 'Revolutionary cleaning technology',
                'price': Decimal('699.99'),
                'compare_price': Decimal('799.99'),
                'category': categories['home-garden'],
                'stock_quantity': 25,
                'is_featured': True,
                'is_bestseller': False,
                'sku': 'DYSON-V15'
            },
            {
                'name': 'Philips Hue Starter Kit',
                'slug': 'philips-hue-starter',
                'description': 'Smart lighting system with voice control',
                'short_description': 'Transform your home with smart lighting',
                'price': Decimal('199.99'),
                'compare_price': Decimal('249.99'),
                'category': categories['home-garden'],
                'stock_quantity': 60,
                'is_featured': False,
                'is_bestseller': True,
                'sku': 'PHILIPS-HUE-KIT'
            },
            # Sports & Outdoors
            {
                'name': 'Yeti Tundra 45 Cooler',
                'slug': 'yeti-tundra-45',
                'description': 'Premium cooler with superior ice retention',
                'short_description': 'Built for the outdoors',
                'price': Decimal('299.99'),
                'compare_price': Decimal('349.99'),
                'category': categories['sports-outdoors'],
                'stock_quantity': 40,
                'is_featured': True,
                'is_bestseller': False,
                'sku': 'YETI-T45'
            },
            {
                'name': 'Garmin Fenix 7',
                'slug': 'garmin-fenix-7',
                'description': 'Premium multisport GPS watch with advanced metrics',
                'short_description': 'Ultimate outdoor adventure watch',
                'price': Decimal('699.99'),
                'compare_price': Decimal('799.99'),
                'category': categories['sports-outdoors'],
                'stock_quantity': 35,
                'is_featured': False,
                'is_bestseller': True,
                'sku': 'GARMIN-F7'
            },
            # Books & Media
            {
                'name': 'Kindle Paperwhite',
                'slug': 'kindle-paperwhite',
                'description': 'Waterproof e-reader with adjustable warm light',
                'short_description': 'Perfect for reading anywhere',
                'price': Decimal('139.99'),
                'compare_price': Decimal('159.99'),
                'category': categories['books-media'],
                'stock_quantity': 80,
                'is_featured': True,
                'is_bestseller': False,
                'sku': 'KINDLE-PW'
            }
        ]

        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    **product_data,
                    'created_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'✅ Created product: {product.name} (${product.price})')

        # Create shipping methods
        shipping_methods_data = [
            {
                'name': 'Standard Shipping',
                'description': '5-7 business days',
                'base_price': Decimal('9.99'),
                'estimated_days': 5,
                'is_active': True
            },
            {
                'name': 'Express Shipping',
                'description': '2-3 business days',
                'base_price': Decimal('19.99'),
                'estimated_days': 2,
                'is_active': True
            },
            {
                'name': 'Overnight Shipping',
                'description': 'Next business day',
                'base_price': Decimal('29.99'),
                'estimated_days': 1,
                'is_active': True
            }
        ]

        for shipping_data in shipping_methods_data:
            shipping_method, created = ShippingMethod.objects.get_or_create(
                name=shipping_data['name'],
                defaults=shipping_data
            )
            if created:
                self.stdout.write(f'✅ Created shipping method: {shipping_method.name}')

        # Create tax rates
        tax_rates_data = [
            {
                'country': 'United States',
                'state': 'CA',
                'city': '',
                'rate': Decimal('0.0825'),  # 8.25%
                'is_active': True
            },
            {
                'country': 'United States',
                'state': 'NY',
                'city': '',
                'rate': Decimal('0.085'),  # 8.5%
                'is_active': True
            },
            {
                'country': 'United States',
                'state': 'TX',
                'city': '',
                'rate': Decimal('0.0625'),  # 6.25%
                'is_active': True
            }
        ]

        for tax_data in tax_rates_data:
            tax_rate, created = TaxRate.objects.get_or_create(
                country=tax_data['country'],
                state=tax_data['state'],
                defaults=tax_data
            )
            if created:
                self.stdout.write(f'✅ Created tax rate: {tax_rate.state} ({tax_rate.rate * 100}%)')

        # Summary
        total_products = Product.objects.count()
        total_categories = Category.objects.count()
        total_shipping = ShippingMethod.objects.count()
        total_tax_rates = TaxRate.objects.count()

        self.stdout.write('\n🎉 Database seeding complete!')
        self.stdout.write(f'📊 Summary:')
        self.stdout.write(f'  • Products: {total_products}')
        self.stdout.write(f'  • Categories: {total_categories}')
        self.stdout.write(f'  • Shipping Methods: {total_shipping}')
        self.stdout.write(f'  • Tax Rates: {total_tax_rates}')
        self.stdout.write(self.style.SUCCESS('\n✅ Integration testing data ready!'))
