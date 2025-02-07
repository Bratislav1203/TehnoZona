import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from "../../services/product.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  brands = [
    { name: 'Beko', imgUrl: 'assets/brands/beko.png' },
    { name: 'Bosch', imgUrl: 'assets/brands/bosch.png' },
    { name: 'Gorenje', imgUrl: 'assets/brands/gorenje.png' },
    { name: 'Haier', imgUrl: 'assets/brands/haier.png' },
    { name: 'Hisense', imgUrl: 'assets/brands/hisense.png' },
    { name: 'Huawei', imgUrl: 'assets/brands/huawei.png' },
    { name: 'LG', imgUrl: 'assets/brands/lg.png' },
    { name: 'Minea', imgUrl: 'assets/brands/minea.png' },
    { name: 'Philips', imgUrl: 'assets/brands/philips.png' },
    { name: 'Samsung', imgUrl: 'assets/brands/samsung.png' },
    { name: 'Xiaomi', imgUrl: 'assets/brands/xiaomi.png' }
  ];


  ngOnInit(): void {
    this.productService.getProducts(1,20).subscribe((data) => {
      this.products = data;
      console.log(this.products);
    });
  }

}
