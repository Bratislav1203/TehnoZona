import { Component, Input } from '@angular/core';
import { FilterCategory, Product, ProductService } from "../../services/product.service";

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {
  @Input() title: string = 'Philips';
  products: Product[] = [];
  isLoading: boolean = false;

  minValue: number = 0;
  maxValue: number = 0;
  initialMinValue: number = 0;
  initialMaxValue: number = 0;


  //Ovo cemo da ucitavamo sa beka
  subCategories = [
    { name: 'Desktop računari', imgUrl: 'assets/placeholder.png' },
    { name: 'Laptopovi', imgUrl: 'assets/placeholder.png' },
    { name: 'Monitori', imgUrl: 'assets/placeholder.png' },
    { name: 'Računarske komponente', imgUrl: 'assets/placeholder.png' },
    { name: 'Konzole i gaming', imgUrl: 'assets/placeholder.png' },
    { name: 'Štampači i oprema', imgUrl: 'assets/placeholder.png' }
  ];

  filterCategories: FilterCategory[] = [
    {
      category: 'Proizvođač',
      types: [
        { name: 'BEKO', quantity: 12 },
        { name: 'BOSCH', quantity: 10 },
        { name: 'CANDY', quantity: 20 },
        { name: 'GORENJE', quantity: 7 },
        { name: 'HAIER', quantity: 4 },
        { name: 'HISENSE', quantity: 3 },
        { name: 'INDESIT', quantity: 1 },
        { name: 'SAMSUNG', quantity: 3 }
      ]
    },
    {
      category: 'Tip uređaja',
      types: [
        { name: 'Frižider', quantity: 8 },
        { name: 'Veš mašina', quantity: 15 },
        { name: 'Mašina za sudove', quantity: 5 },
        { name: 'Mikrotalasna', quantity: 6 }
      ]
    }
  ];

  selectedTypes: { [key: string]: string[] } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.productService.getProducts(1, 20).subscribe(
      (data) => {
        this.products = data;

        if (this.products.length > 0) {
          this.setPriceRange();
        }

        this.isLoading = false;
      },
      (error) => {
        console.error("Greška prilikom učitavanja proizvoda:", error);
        this.isLoading = false;
      }
    );
  }

  private setPriceRange(): void {
    const prices = this.products.map(p => p.b2bcena);
    this.minValue = Math.min(...prices);
    this.maxValue = Math.max(...prices);
    this.initialMinValue = this.minValue;
    this.initialMaxValue = this.maxValue;
  }

  updateSlider(): void {
    if (this.minValue > this.maxValue) {
      [this.minValue, this.maxValue] = [this.maxValue, this.minValue];
    }
  }

  onTypeChange(category: string, type: string, isChecked: boolean) {
    if (!this.selectedTypes[category]) {
      this.selectedTypes[category] = [];
    }

    if (isChecked) {
      this.selectedTypes[category].push(type);
    } else {
      this.selectedTypes[category] = this.selectedTypes[category].filter(t => t !== type);
    }
    console.log(this.selectedTypes);
  }
}
