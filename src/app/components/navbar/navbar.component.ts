import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../../models/product.model';
interface CartItem extends Product { quantity: number; }

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit {
  isScrolled = false;
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  username? = '';

  menuItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/nutrition-profile', label: 'Nutrition' },
    { path: '/meal-plans', label: 'Meal Plans' },
    { path: '/about', label: 'About' },
    { path: '/forum', label: 'Forum' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/delivery', label: 'Delivery' }
  ];
cartItemCount: any;

  cartItems: CartItem[] = [];


  loadCart(): void {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];
    this.cartItemCount = this.cartItems.reduce((s, i) => s + i.quantity, 0);
  }
  constructor(private authService: AuthService) {}

async ngOnInit(): Promise<void> {
    if (await this.authService.isLoggedIn()) {
      const profile = await this.authService.getUserProfile();
      this.username = profile.username;
      console.log('Logged in username:', this.username);
    }
        this.loadCart();

  }


  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  closeProfileDropdown() {
    this.profileDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}