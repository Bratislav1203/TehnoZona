import { Component } from '@angular/core';
import { FilterCategory, Product, ProductService, nameAndImage } from "../../services/product.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { UtilService } from "../../services/util.service";

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {
  totalPages: number = 15;
  visiblePages: number[] = [];

  totalProducts: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  title: string = '';
  products: Product[] = [];
  isLoading: boolean = false;
  glavnaGrupa: string | null = null;
  nadgrupa: string | null = null;
  grupa: string | null = null;
  filterCategories: FilterCategory[] = [];
  expandedCategories: { [key: string]: boolean } = {};

  timeoutId: any;
  minValue: number = undefined;
  maxValue: number = undefined;
  initialMinValue: number = 0;
  initialMaxValue: number = 0;

  subCategories: nameAndImage[] = [];
  selectedTypes: { [key: string]: string[] } = {};

  searchFilter: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    const fullUrlSegments = this.route.snapshot.url.map(segment => segment.path);
    const isSearchRoute = this.route.snapshot.paramMap.has('query');
    const isBrandRoute = fullUrlSegments.length >= 3 && fullUrlSegments[0] === 'categoryPage' && fullUrlSegments[1] === 'brand';
    const brandNameFromBrandRoute = isBrandRoute ? fullUrlSegments[2] : null;
    const searchQuery = this.route.snapshot.paramMap.get('query');

    // Prvo pretplata na parametre rute
    this.route.paramMap.subscribe(params => {
      this.title = params.get('brandName') || '';
      this.glavnaGrupa = params.get('glavnaGrupa');
      this.nadgrupa = params.get('nadgrupa');
      this.grupa = params.get('grupa');

      if (isSearchRoute && searchQuery) {
        this.searchFilter = searchQuery;
        // this.ucitajPretragu();
        return;
      }

      if (isBrandRoute && brandNameFromBrandRoute) {
        this.ucitajBrend(brandNameFromBrandRoute);
        return;
      }

      if (this.glavnaGrupa) {
        this.productService.getProizvodjaciCount(1, this.glavnaGrupa).subscribe(
          (data) => {
            this.filterCategories = [{
              category: 'Proizvođač',
              types: Object.entries(data).map(([name, quantity]) => ({ name, quantity }))
            }];
          },
          (error) => {
            console.error("Greška prilikom učitavanja broja proizvoda po proizvođačima:", error);
          }
        );

        this.productService.getNadgrupeZaGrupu(this.glavnaGrupa).subscribe(
          (nadgrupe: string[]) => {
            this.subCategories = nadgrupe.map(naziv => ({
              name: this.utilService.formatirajNaziv(naziv),
              imgUrl: `assets/subcategories/${naziv}.jpg`
            }));
          },
          (error) => {
            console.error("Greška prilikom učitavanja nadgrupa:", error);
          }
        );
      }
    });

    // Posebna pretplata na query parametre
    this.route.queryParams.subscribe(queryParams => {
      const hasPage = 'page' in queryParams;
      const hasMaxCena = 'maxCena' in queryParams;
      if (!hasPage && !hasMaxCena) {
        this.currentPage = 0;
        this.pageSize = 20;
      }

      this.currentPage = +queryParams['page'] || this.currentPage || 0;
      this.minValue = +queryParams['minCena'] || 0;
      this.maxValue = +queryParams['maxCena'] || 0;

      const proizvodjaciParam = queryParams['proizvodjaci'];
      if (proizvodjaciParam) {
        this.selectedTypes['Proizvođač'] = proizvodjaciParam.split(',');
      } else {
        this.selectedTypes['Proizvođač'] = [];
      }

      console.log(this.nadgrupa + this.grupa);
      if (this.nadgrupa && this.grupa == null) {
        console.log(this.nadgrupa + this.grupa);
        this.ucitajStranicuZaNadgrupu();
      } else if (this.glavnaGrupa) {
        this.ucitajStranicu();
      }
    });
  }



  ucitajStranicu(): void {
    if (!this.glavnaGrupa) return;

    this.isLoading = true;

    this.productService.getProductsFromCategory(
      1,
      this.glavnaGrupa,
      this.currentPage,
      this.pageSize,
      this.minValue,
      this.maxValue,
      this.selectedTypes['Proizvođač']
    ).subscribe((response) => {
      this.products = response.products;
      this.totalProducts = response.totalCount;
      this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

      // Loguj minimalnu i maksimalnu cenu svih proizvoda
      console.log('MIN CENA:', response.minCena);
      console.log('MAX CENA:', response.maxCena);

      this.initialMinValue = response.minCena;
      this.initialMaxValue = response.maxCena;

      if (this.minValue === undefined || this.minValue === null || this.minValue === 0) {
        this.minValue = response.minCena;
      }
      if (this.maxValue === undefined || this.maxValue === null || this.maxValue === 0) {
        this.maxValue = response.maxCena;
      }


      this.updateVisiblePages();
      this.isLoading = false;
    }, (error) => {
      console.error('Greška prilikom učitavanja proizvoda iz glavne grupe:', error);
      this.isLoading = false;
    });
  }



  ucitajStranicuZaNadgrupu(): void {
    if (!this.glavnaGrupa || !this.nadgrupa) return;

    this.isLoading = true;

    const selektovaniProizvodjaci = this.selectedTypes['Proizvođač'] || [];

    this.productService.getProductsFromNadgrupa(
      1,
      this.glavnaGrupa,
      this.nadgrupa,
      this.currentPage,
      this.pageSize,
      this.minValue,
      this.maxValue,
      selektovaniProizvodjaci
    ).subscribe(
      (data) => {
        this.products = data;
        this.setPriceRange();
        this.totalPages = Math.ceil(300 / this.pageSize); // TODO: zameni sa backend vrednošću kada bude dostupna
        this.updateVisiblePages();
        this.isLoading = false;
        console.log(data);
      },
      (error) => {
        console.error("Greška prilikom učitavanja proizvoda iz nadgrupe:", error);
        this.isLoading = false;
      }
    );
  }


  toggleCategory(category: string) {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }

  isExpanded(category: string): boolean {
    return this.expandedCategories[category] || false;
  }

  private setPriceRange(): void {
    if (!this.products || this.products.length === 0) return;

    const prices = this.products.map(p => p.b2bcena);
    this.minValue = Math.min(...prices);
    this.maxValue = Math.max(...prices);
    this.initialMinValue = this.minValue;
    this.initialMaxValue = this.maxValue;
  }

  updateVisiblePages(): void {
    const maxVisible = 5;
    const pages = [];

    let start = Math.max(0, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    this.visiblePages = pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.navigateWithFilters();
  }

  goToPrevious(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.navigateWithFilters();
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.navigateWithFilters();
    }
  }

  updateSlider(): void {
    if (this.minValue > this.maxValue) {
      [this.minValue, this.maxValue] = [this.maxValue, this.minValue];
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.navigateWithFilters();
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
    this.navigateWithFilters();
  }

  navigateWithFilters() {
    const queryParams: any = {
      page: this.currentPage !== undefined ? this.currentPage : 0,
      size: this.pageSize !== undefined ? this.pageSize : 20,
      minCena: this.minValue,
      maxCena: this.maxValue
    };
    console.log(this.selectedTypes);
    if (this.selectedTypes['Proizvođač']) {
      console.log("uso");
      queryParams['proizvodjaci'] = this.selectedTypes['Proizvođač'].join(',');
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  normalizeFileName(naziv: string): string {
    const mapaZamene = {
      'š': 's', 'Š': 'S',
      'ć': 'c', 'Ć': 'C',
      'č': 'c', 'Č': 'C',
      'đ': 'dj', 'Đ': 'Dj',
      'ž': 'z', 'Ž': 'Z'
    };

    const bezDijakritika = naziv.split('').map(char =>
      mapaZamene[char] || char
    ).join('');

    return bezDijakritika.toUpperCase();
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/noImageAvailable.jpg';
  }

  ucitajBrend(brandName: string): void {
    // this.isLoading = true;
    //
    // this.productService.getProductsByBrand(
    //   1, // vendorId, možeš da zameniš ako je dinamički
    //   brandName,
    //   this.currentPage,
    //   this.pageSize,
    //   this.minValue,
    //   this.maxValue
    // ).subscribe(
    //   data => {
    //     this.products = data;
    //     this.setPriceRange();
    //     this.totalPages = Math.ceil(300 / this.pageSize); // zameni kada backend vrati ukupan broj
    //     this.updateVisiblePages();
    //     this.isLoading = false;
    //   },
    //   error => {
    //     console.error('Greška prilikom učitavanja proizvoda po brendu:', error);
    //     this.isLoading = false;
    //   }
    // );
  }

}
