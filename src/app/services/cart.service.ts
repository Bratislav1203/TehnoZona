import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>(this.loadCartFromLocalStorage());

  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.cart = this.loadCartFromLocalStorage();
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
  }

  private loadCartFromLocalStorage(): Product[] {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.sifra === product.sifra);
    if (existingItem) {
      existingItem.cartKolicina += product.cartKolicina ?? 1; // Dodaj količinu ako postoji, inače 1
    } else {
      this.cart.push({ ...product, cartKolicina: product.cartKolicina ?? 1 });
    }
    this.saveCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }


  removeFromCart(product: Product): void {
    this.cart = this.cart.filter(item => item.sifra !== product.sifra);
    this.saveCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getCartItems(): Product[] {
    return this.cart;
  }

  updateQuantity(product: Product, quantity: number): void {
    const index = this.cart.findIndex(item => item.sifra === product.sifra);
    if (index !== -1) {
      this.cart[index].cartKolicina = quantity;
      this.saveCartToLocalStorage();
      this.cartSubject.next(this.cart);
    }
  }

  clearCart(): void {
    this.cart = [];
    this.saveCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }
}
