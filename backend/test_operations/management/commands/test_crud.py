from django.core.management.base import BaseCommand
from apps.products.models import Category, Product
from apps.users.models import User
from decimal import Decimal


class Command(BaseCommand):
    help = 'Quick test of CRUD operations for products'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Testing CRUD Operations...\n')
        
        # Get admin user and electronics category
        user = User.objects.get(email='admin@example.com')
        category = Category.objects.get(slug='electronics')
        
        # CREATE - Add new product
        self.stdout.write('📝 CREATE - Adding new product...')
        new_product = Product.objects.create(
            name='Google Pixel 8 Pro',
            slug='google-pixel-8-pro',
            description='Latest Google flagship with advanced AI and camera features',
            short_description='AI-powered Android smartphone',
            price=Decimal('899.99'),
            compare_price=Decimal('999.99'),
            category=category,
            stock_quantity=25,
            is_featured=True,
            created_by=user
        )
        self.stdout.write(f'✅ Created: {new_product.name} (${new_product.price})')
        
        # READ - Get the product
        self.stdout.write('\n📖 READ - Retrieving product...')
        product = Product.objects.get(slug='google-pixel-8-pro')
        self.stdout.write(f'✅ Retrieved: {product.name} - Stock: {product.stock_quantity}')
        
        # UPDATE - Modify product
        self.stdout.write('\n✏️ UPDATE - Modifying product...')
        old_price = product.price
        product.price = Decimal('849.99')
        product.stock_quantity = 30
        product.save()
        self.stdout.write(f'✅ Updated: Price ${old_price} → ${product.price}, Stock: {product.stock_quantity}')
        
        # List current products
        self.stdout.write('\n📦 Current Products:')
        products = Product.objects.all().order_by('-created_at')[:5]
        for p in products:
            self.stdout.write(f'  • {p.name} (${p.price}) - Stock: {p.stock_quantity}')
        
        # DELETE - Remove test product
        self.stdout.write('\n🗑️ DELETE - Removing test product...')
        product.delete()
        self.stdout.write('✅ Deleted test product')
        
        # Final count
        total_products = Product.objects.count()
        self.stdout.write(f'\n🎉 CRUD Test Complete! Total products: {total_products}')
        self.stdout.write(self.style.SUCCESS('All operations successful! ✅'))
