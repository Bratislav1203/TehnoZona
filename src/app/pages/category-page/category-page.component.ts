import { Component } from '@angular/core';
import { FilterCategory, Product, ProductService } from "../../services/product.service";
import { ActivatedRoute } from "@angular/router";
import { CartService } from "../../services/cart.service";

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {
  title: string = 'Philips';
  products: Product[] = [];
  isLoading: boolean = false;
  glavnaGrupa: string | null = null;
  nadgrupa: string | null = null;
  grupa: string | null = null;
  filterCategories: FilterCategory[] = [];
  expandedCategories: { [key: string]: boolean } = {};

  timeoutId: any;
  minValue: number = 0;
  maxValue: number = 0;
  initialMinValue: number = 0;
  initialMaxValue: number = 0;

  subCategories = [
    { name: 'Desktop računari', imgUrl: 'assets/placeholder.png' },
    { name: 'Laptopovi', imgUrl: 'assets/placeholder.png' },
    { name: 'Monitori', imgUrl: 'assets/placeholder.png' },
    { name: 'Računarske komponente', imgUrl: 'assets/placeholder.png' },
    { name: 'Konzole i gaming', imgUrl: 'assets/placeholder.png' },
    { name: 'Štampači i oprema', imgUrl: 'assets/placeholder.png' }
  ];

  selectedTypes: { [key: string]: string[] } = {};

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('brandName') || '';
      this.glavnaGrupa = params.get('glavnaGrupa');
      this.nadgrupa = params.get('nadgrupa');
      this.grupa = params.get('grupa');

      this.isLoading = true;

      if (this.nadgrupa && !this.grupa) {
        this.productService.getProductsFromNadgrupa(1, this.glavnaGrupa!, this.nadgrupa!, 20).subscribe(
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
      } else {
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

      if (this.glavnaGrupa) {
        this.productService.getProizvodjaciCount(1, this.glavnaGrupa).subscribe(
          (data) => {
            this.filterCategories = [{
              category: 'Proizvođač',
              types: Object.entries(data).map(([name, quantity]) => ({ name, quantity }))
            }];
            console.log(this.filterCategories);
          },
          (error) => {
            console.error("Greška prilikom učitavanja broja proizvoda po proizvođačima:", error);
          }
        );
      }
    });
  }


  toggleCategory(category: string) {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }

  isExpanded(category: string): boolean {
    return this.expandedCategories[category] || false;
  }

  private setPriceRange(): void {
    const prices = this.products.map(p => p.b2bcena);
    this.minValue = Math.min(...prices);
    this.maxValue = Math.max(...prices);
    this.initialMinValue = this.minValue;
    this.initialMaxValue = this.maxValue;
    console.log()
  }


  updateSlider(): void {
    if (this.minValue > this.maxValue) {
      [this.minValue, this.maxValue] = [this.maxValue, this.minValue];
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.productService.getProizvodjaciCountNadgrupaWithPrice(1, this.glavnaGrupa, this.minValue, this.maxValue).subscribe(
        (data) => {
          this.filterCategories = [{
            category: 'Proizvođač',
            types: Object.entries(data).map(([name, quantity]) => ({ name, quantity }))
          }];
          console.log('Broj proizvoda po proizvođačima:', data);
        },
        (error) => {
          console.error('Greška pri učitavanju proizvođača:', error);
        }
      );
      this.productService.getProductsFromNadgrupaWithPrice(1, this.glavnaGrupa, this.nadgrupa, this.minValue, this.maxValue).subscribe(
        (data) => {
          console.log('Filtrirani proizvodi:', data);
          this.products = data;
        },
        (error) => {
          console.error('Greška pri učitavanju proizvoda:', error);
        }
      );

    }, 300);
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
