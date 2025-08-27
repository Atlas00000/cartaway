#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.append('/app')
django.setup()

from apps.products.models import Category, Product
from apps.users.models import User
from decimal import Decimal

def test_crud():
    print("Testing CRUD operations...")
    
    # Get admin user
    user = User.objects.get(email='admin@example.com')
    
    # Get Electronics category
    category = Category.objects.get(slug='electronics')
    
    # CREATE - Add a new product
    new_product = Product.objects.create(
        name='Samsung Galaxy S24 Ultra',
        slug='samsung-galaxy-s24-ultra',
        description='Latest Samsung flagship with S Pen and advanced AI features',
        short_description='Premium Android smartphone with S Pen',
        price=Decimal('1199.99'),
        compare_price=Decimal('1299.99'),
        category=category,
        stock_quantity=35,
        is_featured=True,
        created_by=user
    )
    print(f"✅ Created product: {new_product.name}")
    
    # READ - Get the product
    product = Product.objects.get(slug='samsung-galaxy-s24-ultra')
    print(f"✅ Read product: {product.name} - Price: ${product.price}")
    
    # UPDATE - Modify the product
    product.price = Decimal('1099.99')
    product.stock_quantity = 40
    product.save()
    print(f"✅ Updated product: {product.name} - New price: ${product.price}")
    
    # List all products
    products = Product.objects.all()
    print(f"\n📦 Total products in database: {products.count()}")
    print("Recent products:")
    for p in products.order_by('-created_at')[:5]:
        print(f"  - {p.name} (${p.price}) - Stock: {p.stock_quantity}")
    
    # DELETE - Remove the test product
    product.delete()
    print(f"✅ Deleted test product")
    
    print("\n🎉 CRUD operations test completed successfully!")

if __name__ == '__main__':
    test_crud()
