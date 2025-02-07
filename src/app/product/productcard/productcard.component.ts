import { Component, Input, OnInit } from '@angular/core';
import { Product, ProductService } from "../../services/product.service";

@Component({
  selector: 'app-productcard',
  templateUrl: './productcard.component.html',
  styleUrls: ['./productcard.component.css']
})
export class ProductcardComponent implements OnInit {

  @Input() product: Product;

  constructor(private productService: ProductService) {
  }
  ngOnInit() {
  }

  setCurrentProduct(product: Product) {
    this.productService.setCurrentProduct(product);
  }
}

