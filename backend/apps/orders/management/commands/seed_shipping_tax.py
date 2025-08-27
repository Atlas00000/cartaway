from django.core.management.base import BaseCommand
from apps.orders.models import ShippingMethod, TaxRate


class Command(BaseCommand):
    help = 'Create sample shipping methods and tax rates for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample shipping methods and tax rates...')

        # Create shipping methods
        shipping_methods_data = [
            {
                'name': 'Standard Shipping',
                'description': 'Standard ground shipping (3-5 business days)',
                'base_price': 5.99,
                'estimated_days': 5
            },
            {
                'name': 'Express Shipping',
                'description': 'Express shipping (1-2 business days)',
                'base_price': 12.99,
                'estimated_days': 2
            },
            {
                'name': 'Overnight Shipping',
                'description': 'Overnight delivery (next business day)',
                'base_price': 24.99,
                'estimated_days': 1
            },
            {
                'name': 'Free Shipping',
                'description': 'Free shipping on orders over $50 (5-7 business days)',
                'base_price': 0.00,
                'estimated_days': 7
            }
        ]

        for method_data in shipping_methods_data:
            method, created = ShippingMethod.objects.get_or_create(
                name=method_data['name'],
                defaults=method_data
            )
            if created:
                self.stdout.write(f'Created shipping method: {method.name}')
            else:
                self.stdout.write(f'Shipping method already exists: {method.name}')

        # Create tax rates
        tax_rates_data = [
            {
                'country': 'United States',
                'state': 'California',
                'city': 'Los Angeles',
                'rate': 0.0975  # 9.75%
            },
            {
                'country': 'United States',
                'state': 'New York',
                'city': 'New York City',
                'rate': 0.08875  # 8.875%
            },
            {
                'country': 'United States',
                'state': 'Texas',
                'rate': 0.0625  # 6.25%
            },
            {
                'country': 'United States',
                'state': 'Florida',
                'rate': 0.06  # 6%
            },
            {
                'country': 'United States',
                'state': 'Washington',
                'rate': 0.065  # 6.5%
            }
        ]

        for tax_data in tax_rates_data:
            tax_rate, created = TaxRate.objects.get_or_create(
                country=tax_data['country'],
                state=tax_data['state'],
                city=tax_data.get('city'),
                defaults=tax_data
            )
            if created:
                self.stdout.write(f'Created tax rate: {tax_rate}')
            else:
                self.stdout.write(f'Tax rate already exists: {tax_rate}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample shipping methods and tax rates!')
        )
