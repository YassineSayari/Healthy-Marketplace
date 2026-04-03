import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderRequest } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../auth/auth.service';


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface BillingAddress {
  sameAsShipping: boolean;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface PaymentInfo {
  method: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;

  currentStep: number = 0;
  steps: string[] = ['Shipping', 'Payment', 'Review'];

  shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Standard Delivery', price: 5.99, days: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', price: 12.99, days: '1-2 business days' },
    { id: 'same-day', name: 'Same Day Delivery', price: 19.99, days: 'Today' }
  ];

  paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'fas fa-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
    { id: 'applepay', name: 'Apple Pay', icon: 'fab fa-apple-pay' }
  ];

  cartItems: CartItem[] = [
    { id: 1, name: 'Organic Apples', price: 4.99, quantity: 2, image: 'assets/products/apples.jpg' },
    { id: 2, name: 'Fresh Spinach', price: 2.99, quantity: 1, image: 'assets/products/spinach.jpg' },
    { id: 3, name: 'Organic Milk', price: 3.99, quantity: 3, image: 'assets/products/milk.jpg' }
  ];

  shippingAddress: ShippingAddress = {
    firstName: '', lastName: '', email: '',
    address: '', city: '', state: '', zip: '', phone: ''
  };

  billingAddress: BillingAddress = {
    sameAsShipping: true, firstName: '', lastName: '',
    address: '', city: '', state: '', zip: ''
  };

  paymentInfo: PaymentInfo = {
    method: 'card', cardNumber: '', cardName: '',
    expiry: '', cvv: '', saveCard: false
  };

  selectedShipping: string = 'standard';
  orderNotes: string = '';
  isProcessing: boolean = false;
  orderComplete: boolean = false;
  orderNumber: string = '';
  errorMessage: string = '';


  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadSavedData();
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get shippingCost(): number {
    const method = this.shippingMethods.find(m => m.id === this.selectedShipping);
    return method ? method.price : 0;
  }

  get tax(): number {
    return this.subtotal * 0.1;
  }

  get total(): number {
    return this.subtotal + this.shippingCost + this.tax;
  }

  nextStep(): void {
    if (this.isStepValid() && this.currentStep < this.steps.length - 1) {
      this.saveStepData();
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 0: return this.isShippingValid();
      case 1: return this.isPaymentValid();
      default: return true;
    }
  }

  isShippingValid(): boolean {
    return !!(
      this.shippingAddress.firstName &&
      this.shippingAddress.lastName &&
      this.shippingAddress.email &&
      this.shippingAddress.address &&
      this.shippingAddress.city &&
      this.shippingAddress.state &&
      this.shippingAddress.zip
    );
  }

  isPaymentValid(): boolean {
    if (this.paymentInfo.method === 'card') {
      return !!(
        this.paymentInfo.cardNumber &&
        this.paymentInfo.cardName &&
        this.paymentInfo.expiry &&
        this.paymentInfo.cvv
      );
    }
    return true;
  }

  saveStepData(): void {
    const checkoutData = {
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      paymentInfo: this.paymentInfo,
      selectedShipping: this.selectedShipping,
      currentStep: this.currentStep
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
  }

  loadSavedData(): void {
    const saved = localStorage.getItem('checkoutData');
    if (saved) {
      const data = JSON.parse(saved);
      this.shippingAddress = data.shippingAddress || this.shippingAddress;
      this.billingAddress = data.billingAddress || this.billingAddress;
      this.paymentInfo = data.paymentInfo || this.paymentInfo;
      this.selectedShipping = data.selectedShipping || this.selectedShipping;
      this.currentStep = data.currentStep || 0;
    }
  }

onSubmit(): void {
    if (this.currentStep !== this.steps.length - 1) return;

    this.isProcessing = true;
    this.errorMessage = '';
    const now = new Date().toISOString();

    const userId = this.authService.getUserId();

    const orderPayload: OrderRequest = {
      userId: userId,         
      totalPrice: this.total,
      status: 'PENDING',
      createdAt: now,
      payment: {
        amount: this.total,
        method: this.paymentInfo.method.toUpperCase(),
        paymentStatus: 'COMPLETED',
        paymentDate: now
      }
    };

    this.orderService.placeOrder(orderPayload).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.orderComplete = true;
        this.orderNumber = 'ORD-' + response.id;
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('cart');
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = 'Failed to place order. Please try again.';
        console.error('Order error:', err);
      }
    });
  }

  formatCardNumber(): void {
    let value = this.paymentInfo.cardNumber.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    this.paymentInfo.cardNumber = formatted;
  }

  formatExpiry(): void {
    let value = this.paymentInfo.expiry.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.paymentInfo.expiry = value;
  }
  get selectedShippingMethod(): ShippingMethod | undefined {
  return this.shippingMethods.find(m => m.id === this.selectedShipping);
}

get selectedPaymentMethod(): PaymentMethod | undefined {
  return this.paymentMethods.find(m => m.id === this.paymentInfo.method);
}
}