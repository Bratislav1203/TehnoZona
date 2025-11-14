import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from "../../services/product.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {CartService} from "../../services/cart.service";

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

  constructor(private productService: ProductService, private sanitizer: DomSanitizer, private cartService: CartService) {}

  ngOnInit() {
    this.product = this.productService.getCurrentProduct();
    if (!this.product) {
      const currentUrl = window.location.href;
      const barcode = currentUrl.split('/').pop();
      if (!barcode) {
        console.error('Barcode cannot be extracted from URL:', currentUrl);
        return;
      }
      this.productService.getProductByBarcode(2, barcode)
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
    return input
      .replace(/<br\s*\/?>\s*/g, '') // Uklanja sve <br> tagove
      .replace(/\s+/g, ' ') // Uklanja višestruke razmake
      .trim(); // Uklanja prazne prostore sa početka i kraja stringa
  }
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
