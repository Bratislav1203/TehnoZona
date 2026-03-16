import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from "../../services/product.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CartService } from "../../services/cart.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  mainImage: string;
  currentImageIndex = 0;
  product: Product;
  sanitizedDescription: SafeHtml;

  constructor(private productService: ProductService, private sanitizer: DomSanitizer, private cartService: CartService) { }

  ngOnInit() {
    this.product = this.productService.getCurrentProduct();
    if (!this.product) {
      const currentUrl = window.location.href;
      const vendorId = 0; // Unified vendorId
      const barcode = currentUrl.split('/').pop();
      if (!barcode) {
        console.error('Barcode cannot be extracted from URL:', currentUrl);
        return;
      }
      this.productService.getProductByBarcode(vendorId, barcode)
        .subscribe(prod => {
          this.product = prod;
          this.mainImage = prod.slike?.length ? prod.slike[0] : null;
          const cleaned = this.cleanHtml(prod.opis);
          this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(cleaned);
        });
      return;
    }
    this.mainImage = this.product.slike[0];
    const cleanedDescription = this.cleanHtml(this.product.opis);
    this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(cleanedDescription);
  }

  changeMainImage(image: string) {
    this.mainImage = image;
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.product.slike.length - 1;
    }
    this.mainImage = this.product.slike[this.currentImageIndex];
  }

  nextImage() {
    if (this.currentImageIndex < this.product.slike.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
    this.mainImage = this.product.slike[this.currentImageIndex];
  }

  cleanHtml(input: string): string {
    if (!input) return '';
    // Uklanja višestruke razmake i trimuje standardno
    let cleaned = input.replace(/\s+/g, ' ').trim();
    // Uklanja vodeće i prateće <br> tagove i &nbsp;
    cleaned = cleaned.replace(/^(<br\s*\/?>|&nbsp;|\s)+|(<br\s*\/?>|&nbsp;|\s)+$/gi, '');
    return cleaned;
  }
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
