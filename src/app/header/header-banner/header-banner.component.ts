import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from "../../services/cart.service";
import { Product } from "../../services/product.service";

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent implements OnInit {

  cartCount = 0;
  searchTerm: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: Product[]) => {
      this.cartCount = items.length;
    });
  }

  onSearch(): void {
    const trimmed = this.searchTerm.trim();
    if (trimmed) {
      this.router.navigate(['/search', this.searchTerm.trim()]);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
