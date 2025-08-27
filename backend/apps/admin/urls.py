from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Products
    path('products/', views.AdminProductList.as_view(), name='admin_product_list'),
    path('products/<int:pk>/', views.AdminProductDetail.as_view(), name='admin_product_detail'),
    
    # Orders
    path('orders/', views.AdminOrderList.as_view(), name='admin_order_list'),
    path('orders/<int:pk>/', views.AdminOrderDetail.as_view(), name='admin_order_detail'),
    
    # Users
    path('users/', views.AdminUserList.as_view(), name='admin_user_list'),
    path('users/<int:pk>/', views.AdminUserDetail.as_view(), name='admin_user_detail'),
    
    # Categories
    path('categories/', views.AdminCategoryList.as_view(), name='admin_category_list'),
    path('categories/<int:pk>/', views.AdminCategoryDetail.as_view(), name='admin_category_detail'),
    
    # Analytics
    path('analytics/', views.admin_analytics, name='admin_analytics'),
    
    # Inventory
    path('inventory/', views.admin_inventory, name='admin_inventory'),
    path('inventory/<int:product_id>/restock/', views.admin_inventory_restock, name='admin_inventory_restock'),
    
    # Settings
    path('settings/', views.admin_settings, name='admin_settings'),
]
