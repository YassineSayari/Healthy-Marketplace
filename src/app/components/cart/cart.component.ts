import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cartItems = [
    {
      id: 1,
      name: 'Organic Apples',
      price: 4.99,
      quantity: 2,
      image: 'assets/products/apples.jpg'
    },
    {
      id: 2,
      name: 'Fresh Spinach',
      price: 2.99,
      quantity: 1,
      image: 'assets/products/spinach.jpg'
    },
    {
      id: 3,
      name: 'Organic Milk',
      price: 3.99,
      quantity: 3,
      image: 'assets/products/milk.jpg'
    }
  ];

  get subtotal() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  shipping = 5.99;
  tax = this.subtotal * 0.1;
  
  get total() {
    return this.subtotal + this.shipping + this.tax;
  }

  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      item.quantity = newQuantity;
    }
  }

  removeItem(item: any) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }
}