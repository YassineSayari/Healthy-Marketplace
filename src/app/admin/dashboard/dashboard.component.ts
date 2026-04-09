import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OrderResponse, OrderRequest } from '../../models/order.model';
import { Product, Category, ProductRequest, CategoryRequest } from '../../models/product.model';
import { OrdersByStatusPipe, LowStockPipe, ProductsByCategoryPipe, CountPipe } from '../../pipes/admin.pipes';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { SidenavComponent, AdminSection } from '../sidenav/sidenav.component';



// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  categories: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidenavComponent, OrdersByStatusPipe, LowStockPipe, ProductsByCategoryPipe, CountPipe],
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

  // ── Layout ──────────────────────────────────────────────────
  activeSection: AdminSection = 'dashboard';
  loading = false;
  username = '';
  userId = '';

  // ── Stats ────────────────────────────────────────────────────
  stats: Stats = {
    totalProducts: 0, totalOrders: 0,
    totalRevenue: 0, pendingOrders: 0,
    completedOrders: 0, categories: 0
  };

  // ── Data ─────────────────────────────────────────────────────
  products: Product[] = [];
  orders: OrderResponse[] = [];
  categories: Category[] = [];

  // ── Search / filter ──────────────────────────────────────────
  productSearch = '';
  orderSearch = '';
  categorySearch = '';
  orderStatusFilter = '';

  // ─── Confirm Delete ──────────────────────────────────────────
  confirmDelete: { type: 'product' | 'order' | 'category'; id: number; name: string } | null = null;

  // ─── Notification ────────────────────────────────────────────
  toast: { message: string; type: 'success' | 'error' } | null = null;

  // ─────────────────────────────────────────────────────────────
  // PRODUCT MODAL
  // ─────────────────────────────────────────────────────────────
  showProductModal = false;
  editingProduct: Product | null = null;
  productForm: ProductRequest = { name: '', description: '', price: 0, stock: 0, category: { id: 0 } };

  // ─────────────────────────────────────────────────────────────
  // ORDER MODAL
  // ─────────────────────────────────────────────────────────────
  showOrderModal = false;
  editingOrder: OrderResponse | null = null;
  orderForm: OrderRequest = {
    userId: '',
    totalPrice: 0,
    status: 'PENDING',
    createdAt: new Date().toISOString().slice(0, 19),
    payment: {
      amount: 0,
      method: 'CARD',
      paymentStatus: 'PENDING',
      paymentDate: new Date().toISOString().slice(0, 19)
    }
  };

  // ─────────────────────────────────────────────────────────────
  // CATEGORY MODAL
  // ─────────────────────────────────────────────────────────────
  showCategoryModal = false;
  editingCategory: Category | null = null;
  categoryForm: CategoryRequest = { name: '', description: '' };

  // ─────────────────────────────────────────────────────────────

  readonly orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  readonly paymentMethods = ['CARD', 'PAYPAL', 'APPLEPAY', 'CASH'];
  readonly paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

  constructor(
    private auth: AuthService,
    private productSvc: ProductService,
    private orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername();
    this.userId = this.auth.getUserId();
    this.loadAll();
  }

  // ─── Load all data ────────────────────────────────────────────
  loadAll(): void {
    this.loading = true;
    forkJoin({
      products: this.productSvc.getAllProducts(),
      orders: this.orderSvc.getAll(),
      categories: this.productSvc.getAllCategories()
    }).subscribe({
      next: ({ products, orders, categories }) => {
        this.products = products;
        this.orders = orders;
        this.categories = categories;
        this.computeStats();
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load data', 'error');
        this.loading = false;
      }
    });
  }

  computeStats(): void {
    this.stats = {
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalRevenue: this.orders.reduce((s, o) => s + o.totalPrice, 0),
      pendingOrders: this.orders.filter(o => o.status === 'PENDING').length,
      completedOrders: this.orders.filter(o => o.status === 'DELIVERED').length,
      categories: this.categories.length
    };
  }

  // ─── Filtered lists ───────────────────────────────────────────
  get filteredProducts(): Product[] {
    const q = this.productSearch.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.name.toLowerCase().includes(q)
    );
  }

  get filteredOrders(): OrderResponse[] {
    const q = this.orderSearch.toLowerCase();
    return this.orders.filter(o => {
      const matchQ = o.id.toString().includes(q) || o.userId.toLowerCase().includes(q);
      const matchStatus = this.orderStatusFilter ? o.status === this.orderStatusFilter : true;
      return matchQ && matchStatus;
    });
  }

  get filteredCategories(): Category[] {
    const q = this.categorySearch.toLowerCase();
    return this.categories.filter(c => c.name.toLowerCase().includes(q));
  }

  // ─────────────────────────────────────────────────────────────
  // PRODUCT CRUD
  // ─────────────────────────────────────────────────────────────
  openAddProduct(): void {
    this.editingProduct = null;
    this.productForm = { name: '', description: '', price: 0, stock: 0, category: { id: this.categories[0]?.id || 0 } };
    this.showProductModal = true;
  }

  openEditProduct(p: Product): void {
    this.editingProduct = p;
    this.productForm = {
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      category: { id: p.category?.id || 0 }
    };
    this.showProductModal = true;
  }

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.category.id) return;
    const req$ = this.editingProduct
      ? this.productSvc.updateProduct(this.editingProduct.id, this.productForm)
      : this.productSvc.createProduct(this.productForm);

    req$.subscribe({
      next: () => {
        this.showToast(this.editingProduct ? 'Product updated' : 'Product created', 'success');
        this.showProductModal = false;
        this.loadAll();
      },
      error: () => this.showToast('Failed to save product', 'error')
    });
  }

  confirmDeleteProduct(p: Product): void {
    this.confirmDelete = { type: 'product', id: p.id, name: p.name };
  }

  // ─────────────────────────────────────────────────────────────
  // ORDER CRUD
  // ─────────────────────────────────────────────────────────────
  openAddOrder(): void {
    this.editingOrder = null;
    const now = new Date().toISOString().slice(0, 19);
    this.orderForm = {
      userId: this.userId,
      totalPrice: 0,
      status: 'PENDING',
      createdAt: now,
      payment: { amount: 0, method: 'CARD', paymentStatus: 'PENDING', paymentDate: now }
    };
    this.showOrderModal = true;
  }

  openEditOrder(o: OrderResponse): void {
    this.editingOrder = o;
    this.orderForm = {
      userId: o.userId,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      payment: {
        amount: o.payment?.amount || 0,
        method: o.payment?.method || 'CARD',
        paymentStatus: o.payment?.paymentStatus || 'PENDING',
        paymentDate: o.payment?.paymentDate || new Date().toISOString().slice(0, 19)
      }
    };
    this.showOrderModal = true;
  }

  saveOrder(): void {
    const req$ = this.editingOrder
      ? this.orderSvc.updateOrder(this.editingOrder.id, this.orderForm)
      : this.orderSvc.placeOrder(this.orderForm);

    req$.subscribe({
      next: () => {
        this.showToast(this.editingOrder ? 'Order updated' : 'Order created', 'success');
        this.showOrderModal = false;
        this.loadAll();
      },
      error: () => this.showToast('Failed to save order', 'error')
    });
  }

  confirmDeleteOrder(o: OrderResponse): void {
    this.confirmDelete = { type: 'order', id: o.id, name: `Order #${o.id}` };
  }

  // ─────────────────────────────────────────────────────────────
  // CATEGORY CRUD
  // ─────────────────────────────────────────────────────────────
  openAddCategory(): void {
    this.editingCategory = null;
    this.categoryForm = { name: '', description: '' };
    this.showCategoryModal = true;
  }

  openEditCategory(c: Category): void {
    this.editingCategory = c;
    this.categoryForm = { name: c.name, description: c.description || '' };
    this.showCategoryModal = true;
  }

  saveCategory(): void {
    if (!this.categoryForm.name) return;
    const req$ = this.editingCategory
      ? this.productSvc.updateCategory(this.editingCategory.id, this.categoryForm)
      : this.productSvc.createCategory(this.categoryForm);

    req$.subscribe({
      next: () => {
        this.showToast(this.editingCategory ? 'Category updated' : 'Category created', 'success');
        this.showCategoryModal = false;
        this.loadAll();
      },
      error: () => this.showToast('Failed to save category', 'error')
    });
  }

  confirmDeleteCategory(c: Category): void {
    this.confirmDelete = { type: 'category', id: c.id, name: c.name };
  }

  // ─────────────────────────────────────────────────────────────
  // SHARED DELETE
  // ─────────────────────────────────────────────────────────────
  executeDelete(): void {
    if (!this.confirmDelete) return;
    const { type, id } = this.confirmDelete;

    const req$ =
      type === 'product'  ? this.productSvc.deleteProduct(id)  :
      type === 'order'    ? this.orderSvc.deleteOrder(id)       :
      this.productSvc.deleteCategory(id);

    req$.subscribe({
      next: () => {
        this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
        this.confirmDelete = null;
        this.loadAll();
      },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3500);
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      PENDING:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      CONFIRMED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      SHIPPED:   'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      DELIVERED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    return map[status] ?? 'bg-gray-500/10 text-gray-400';
  }

  paymentColor(status: string): string {
    const map: Record<string, string> = {
      COMPLETED: 'text-emerald-400',
      PENDING:   'text-amber-400',
      FAILED:    'text-red-400',
      REFUNDED:  'text-violet-400',
    };
    return map[status] ?? 'text-gray-400';
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }

  formatDate(dt: string): string {
    return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  get greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
}