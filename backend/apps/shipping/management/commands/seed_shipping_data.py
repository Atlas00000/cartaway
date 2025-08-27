from django.core.management.base import BaseCommand
from apps.shipping.models import Warehouse, Inventory, ShippingZone, ShippingRate
from apps.products.models import Product
from decimal import Decimal


class Command(BaseCommand):
    help = 'Create sample warehouses, inventory, and shipping zones for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample shipping and inventory data...')

        # Create warehouses
        warehouses_data = [
            {
                'name': 'Main Distribution Center',
                'address_line1': '1234 Warehouse Blvd',
                'city': 'Los Angeles',
                'state': 'California',
                'postal_code': '90210',
                'country': 'United States',
                'phone': '555-123-4567',
                'email': 'warehouse@example.com',
                'is_primary': True
            },
            {
                'name': 'East Coast Warehouse',
                'address_line1': '5678 Logistics Ave',
                'city': 'New York',
                'state': 'New York',
                'postal_code': '10001',
                'country': 'United States',
                'phone': '555-987-6543',
                'email': 'eastcoast@example.com',
                'is_primary': False
            },
            {
                'name': 'Central Hub',
                'address_line1': '9012 Storage Way',
                'city': 'Chicago',
                'state': 'Illinois',
                'postal_code': '60601',
                'country': 'United States',
                'phone': '555-456-7890',
                'email': 'central@example.com',
                'is_primary': False
            }
        ]

        warehouses = []
        for warehouse_data in warehouses_data:
            warehouse, created = Warehouse.objects.get_or_create(
                name=warehouse_data['name'],
                defaults=warehouse_data
            )
            warehouses.append(warehouse)
            if created:
                self.stdout.write(f'Created warehouse: {warehouse.name}')
            else:
                self.stdout.write(f'Warehouse already exists: {warehouse.name}')

        # Create shipping zones
        zones_data = [
            {
                'name': 'Local (Same State)',
                'description': 'Same state shipping',
                'countries': ['United States'],
                'states': ['California', 'New York', 'Illinois'],
                'postal_codes': []
            },
            {
                'name': 'Domestic (US)',
                'description': 'Domestic US shipping',
                'countries': ['United States'],
                'states': [],
                'postal_codes': []
            },
            {
                'name': 'West Coast',
                'description': 'West Coast states',
                'countries': ['United States'],
                'states': ['California', 'Oregon', 'Washington', 'Nevada', 'Arizona'],
                'postal_codes': []
            },
            {
                'name': 'East Coast',
                'description': 'East Coast states',
                'countries': ['United States'],
                'states': ['New York', 'New Jersey', 'Pennsylvania', 'Massachusetts', 'Connecticut'],
                'postal_codes': []
            }
        ]

        zones = []
        for zone_data in zones_data:
            zone, created = ShippingZone.objects.get_or_create(
                name=zone_data['name'],
                defaults=zone_data
            )
            zones.append(zone)
            if created:
                self.stdout.write(f'Created shipping zone: {zone.name}')
            else:
                self.stdout.write(f'Shipping zone already exists: {zone.name}')

        # Create shipping rates
        rates_data = [
            # Local rates
            {'zone': zones[0], 'method_name': 'Local Delivery', 'base_rate': 5.99, 'per_item_rate': 0.50, 'estimated_days': 1},
            {'zone': zones[0], 'method_name': 'Local Express', 'base_rate': 12.99, 'per_item_rate': 1.00, 'estimated_days': 1},
            
            # Domestic rates
            {'zone': zones[1], 'method_name': 'Standard Ground', 'base_rate': 8.99, 'per_item_rate': 0.75, 'estimated_days': 5},
            {'zone': zones[1], 'method_name': 'Express 2-Day', 'base_rate': 19.99, 'per_item_rate': 1.50, 'estimated_days': 2},
            {'zone': zones[1], 'method_name': 'Overnight', 'base_rate': 29.99, 'per_item_rate': 2.00, 'estimated_days': 1},
            {'zone': zones[1], 'method_name': 'Free Shipping', 'base_rate': 0.00, 'per_item_rate': 0.00, 'free_shipping_threshold': 50.00, 'estimated_days': 7},
            
            # West Coast rates
            {'zone': zones[2], 'method_name': 'West Coast Ground', 'base_rate': 6.99, 'per_item_rate': 0.60, 'estimated_days': 3},
            {'zone': zones[2], 'method_name': 'West Coast Express', 'base_rate': 15.99, 'per_item_rate': 1.25, 'estimated_days': 1},
            
            # East Coast rates
            {'zone': zones[3], 'method_name': 'East Coast Ground', 'base_rate': 7.99, 'per_item_rate': 0.65, 'estimated_days': 4},
            {'zone': zones[3], 'method_name': 'East Coast Express', 'base_rate': 16.99, 'per_item_rate': 1.30, 'estimated_days': 2}
        ]

        for rate_data in rates_data:
            rate, created = ShippingRate.objects.get_or_create(
                zone=rate_data['zone'],
                method_name=rate_data['method_name'],
                defaults=rate_data
            )
            if created:
                self.stdout.write(f'Created shipping rate: {rate.zone.name} - {rate.method_name}')
            else:
                self.stdout.write(f'Shipping rate already exists: {rate.zone.name} - {rate.method_name}')

        # Create inventory for products
        products = Product.objects.all()
        if products.exists():
            for product in products:
                # Create inventory in primary warehouse
                inventory, created = Inventory.objects.get_or_create(
                    product=product,
                    warehouse=warehouses[0],  # Primary warehouse
                    defaults={
                        'quantity': 50,
                        'reserved_quantity': 0,
                        'low_stock_threshold': 5,
                        'cost_price': product.price * Decimal('0.6'),  # 40% margin
                        'aisle': 'A',
                        'shelf': '1',
                        'bin': '01'
                    }
                )
                if created:
                    self.stdout.write(f'Created inventory for {product.name} at {warehouses[0].name}')
                else:
                    self.stdout.write(f'Inventory already exists for {product.name}')

                # Create inventory in secondary warehouses with lower quantities
                for warehouse in warehouses[1:]:
                    inventory, created = Inventory.objects.get_or_create(
                        product=product,
                        warehouse=warehouse,
                        defaults={
                            'quantity': 25,
                            'reserved_quantity': 0,
                            'low_stock_threshold': 3,
                            'cost_price': product.price * Decimal('0.6'),
                            'aisle': 'B',
                            'shelf': '1',
                            'bin': '01'
                        }
                    )
                    if created:
                        self.stdout.write(f'Created inventory for {product.name} at {warehouse.name}')
                    else:
                        self.stdout.write(f'Inventory already exists for {product.name} at {warehouse.name}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample shipping and inventory data!')
        )
