import { Component, OnInit } from '@angular/core';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  organic: boolean;
  local: boolean;
  description: string;
  seller: string;
  discount?: number;
}

interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  categories: Category[] = [
    { id: 'fruits', name: 'Fruits', icon: 'fas fa-apple-alt', count: 24 },
    { id: 'vegetables', name: 'Vegetables', icon: 'fas fa-carrot', count: 32 },
    { id: 'dairy', name: 'Dairy & Eggs', icon: 'fas fa-cheese', count: 18 },
    { id: 'bakery', name: 'Bakery', icon: 'fas fa-bread-slice', count: 15 },
    { id: 'beverages', name: 'Beverages', icon: 'fas fa-coffee', count: 12 },
    { id: 'meat', name: 'Meat & Poultry', icon: 'fas fa-drumstick-bite', count: 20 },
    { id: 'pantry', name: 'Pantry Staples', icon: 'fas fa-archive', count: 28 },
    { id: 'organic', name: 'Organic Only', icon: 'fas fa-leaf', count: 45 }
  ];

  selectedCategories: string[] = [];
  priceRange: number = 50;
  sortBy: string = 'featured';
  viewMode: 'grid' | 'list' = 'grid';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  searchQuery: string = '';

  products: Product[] = [
    {
      id: 1,
      name: 'Organic Apples',
      price: 4.99,
      originalPrice: 6.99,
      unit: 'kg',
      image: 'assets/products/apples.jpg',
      category: 'fruits',
      rating: 5,
      reviews: 124,
      inStock: true,
      organic: true,
      local: true,
      description: 'Fresh, crisp organic apples from local orchards',
      seller: 'Green Valley Farm',
      discount: 28
    },
    {
      id: 2,
      name: 'Fresh Spinach',
      price: 2.99,
      unit: 'bunch',
      image: 'assets/products/spinach.jpg',
      category: 'vegetables',
      rating: 4,
      reviews: 89,
      inStock: true,
      organic: true,
      local: true,
      description: 'Tender organic spinach leaves, perfect for salads',
      seller: 'Sunshine Organics'
    },
    {
      id: 3,
      name: 'Organic Milk',
      price: 3.99,
      originalPrice: 4.99,
      unit: 'liter',
      image: 'assets/products/milk.jpg',
      category: 'dairy',
      rating: 5,
      reviews: 203,
      inStock: true,
      organic: true,
      local: false,
      description: 'Fresh organic milk from grass-fed cows',
      seller: 'Happy Cow Dairy',
      discount: 20
    },
    {
      id: 4,
      name: 'Whole Wheat Bread',
      price: 2.49,
      unit: 'loaf',
      image: 'assets/products/bread.jpg',
      category: 'bakery',
      rating: 4,
      reviews: 156,
      inStock: true,
      organic: false,
      local: true,
      description: 'Freshly baked organic whole wheat bread',
      seller: 'Artisan Bakery'
    },
    {
      id: 5,
      name: 'Fresh Orange Juice',
      price: 4.99,
      originalPrice: 6.99,
      unit: 'bottle',
      image: 'assets/products/juice.jpg',
      category: 'beverages',
      rating: 5,
      reviews: 178,
      inStock: true,
      organic: true,
      local: false,
      description: 'Cold-pressed organic orange juice',
      seller: 'Citrus Grove',
      discount: 28
    },
    {
      id: 6,
      name: 'Organic Bananas',
      price: 1.99,
      unit: 'kg',
      image: 'assets/products/bananas.jpg',
      category: 'fruits',
      rating: 4,
      reviews: 245,
      inStock: true,
      organic: true,
      local: false,
      description: 'Sweet organic bananas, perfect for smoothies',
      seller: 'Tropical Harvest'
    },
    {
      id: 7,
      name: 'Free Range Eggs',
      price: 5.99,
      originalPrice: 7.99,
      unit: 'dozen',
      image: 'assets/products/eggs.jpg',
      category: 'dairy',
      rating: 5,
      reviews: 312,
      inStock: true,
      organic: true,
      local: true,
      description: 'Farm-fresh free range eggs',
      seller: 'Happy Hens Farm',
      discount: 25
    },
    {
      id: 8,
      name: 'Organic Avocados',
      price: 3.99,
      unit: 'each',
      image: 'assets/products/avocados.jpg',
      category: 'fruits',
      rating: 4,
      reviews: 167,
      inStock: true,
      organic: true,
      local: false,
      description: 'Creamy organic avocados, ready to eat',
      seller: 'Avocado Direct'
    }
  ];

  wishlist: number[] = [];
  recentlyViewed: number[] = [];
  cart: CartItem[] = [];

  constructor() { 
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  ngOnInit(): void {
    this.loadRecentlyViewed();
  }

  get filteredProducts(): Product[] {
    let filtered = [...this.products];
    
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => this.selectedCategories.includes(p.category));
    }
    
    filtered = filtered.filter(p => p.price <= this.priceRange);
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.seller.toLowerCase().includes(query)
      );
    }
    
    if (this.selectedCategories.includes('organic')) {
      filtered = filtered.filter(p => p.organic);
    }
    
    switch(this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    
    return filtered;
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  toggleCategory(categoryId: string): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.priceRange = 50;
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.currentPage = 1;
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity: 1
      };
      this.cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.showNotification(`${product.name} added to cart!`);
  }

  addToWishlist(productId: number): void {
    const index = this.wishlist.indexOf(productId);
    if (index === -1) {
      this.wishlist.push(productId);
      this.showNotification('Added to wishlist!');
    } else {
      this.wishlist.splice(index, 1);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.includes(productId);
  }

  quickView(product: Product): void {
    console.log('Quick view:', product);
  }

  changePage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadRecentlyViewed(): void {
    const viewed = sessionStorage.getItem('recentlyViewed');
    if (viewed) {
      this.recentlyViewed = JSON.parse(viewed);
    }
  }

  trackProductView(productId: number): void {
    if (!this.recentlyViewed.includes(productId)) {
      this.recentlyViewed.unshift(productId);
      if (this.recentlyViewed.length > 10) {
        this.recentlyViewed.pop();
      }
      sessionStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed));
    }
  }

  getDiscountedPrice(product: Product): number {
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }

  getStockStatus(product: Product): { text: string, class: string } {
    if (product.inStock) {
      return {
        text: 'In Stock',
        class: 'text-green-600'
      };
    }
    return {
      text: 'Out of Stock',
      class: 'text-red-600'
    };
  }

  showNotification(message: string): void {
    console.log('Notification:', message);
  }

  compareProducts(productIds: number[]): void {
    console.log('Comparing products:', productIds);
  }
}