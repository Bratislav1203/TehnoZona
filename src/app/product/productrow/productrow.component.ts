import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Product, ProductService } from "../../services/product.service";

@Component({
  selector: 'app-productrow',
  templateUrl: './productrow.component.html',
  styleUrls: ['./productrow.component.css']
})
export class ProductrowComponent implements OnInit {

  @Input() products: any[] = [];


  constructor() {}

  ngOnInit(): void {
  }

}
