import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FilterCategory, Product, ProductService, nameAndImage } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { UtilService } from '../../services/util.service';
import { MockGlavnaGrupaService } from '../../services/mock-glavna-grupa.service'; // 👈 dodato

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {
  totalPages = 0;
  visiblePages: (number | string)[] = [];
  totalProducts = 0;
  currentPage = 0;
  pageSize = 20;

  title = '';
  products: Product[] = [];
  isLoading = false;
  glavnaGrupa: string | null = null;
  nadgrupa: string | null = null;
  grupa: string | null = null;
  filterCategories: FilterCategory[] = [];
  expandedCategories: { [key: string]: boolean } = {};
  selectedTypes: { [key: string]: string[] } = {};

  minValue = 0;
  maxValue = 0;
  initialMinValue = 0;
  initialMaxValue = 0;
  timeoutId: any;

  subCategories: nameAndImage[] = [];
  groups: { name: string }[] = []; // 👈 grupe unutar nadgrupe
  searchFilter = '';
  showMobileFilters = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public utilService: UtilService,
    private mockService: MockGlavnaGrupaService // 👈 novi servis
  ) { }

  ngOnInit(): void {
    const fullUrlSegments = this.route.snapshot.url.map(segment => segment.path);
    const isSearchRoute = this.route.snapshot.paramMap.has('query');
    const isBrandRoute =
      fullUrlSegments.length >= 3 &&
      fullUrlSegments[0] === 'categoryPage' &&
      fullUrlSegments[1] === 'brand';
    const brandNameFromBrandRoute = isBrandRoute ? fullUrlSegments[2] : null;
    const searchQuery = this.route.snapshot.paramMap.get('query');

    combineLatest([this.route.paramMap, this.route.queryParams]).subscribe(
      ([params, queryParams]) => {
        this.title = params.get('brandName') || '';
        this.glavnaGrupa = params.get('glavnaGrupa');
        this.nadgrupa = params.get('nadgrupa')?.toUpperCase() || null;
        this.grupa = params.get('grupa');

        // Query parametri
        this.currentPage = (+queryParams.page || 1) - 1;
        this.pageSize = +queryParams.size || 20;
        this.minValue = +queryParams.minCena || 0;
        this.maxValue = +queryParams.maxCena || 0;

        const proizvodjaciParam = queryParams.proizvodjaci;
        this.selectedTypes.Proizvođač = proizvodjaciParam
          ? Array.from(new Set(proizvodjaciParam.split(',')))
          : [];

        if (isSearchRoute && searchQuery) {
          this.searchFilter = searchQuery;
          this.isLoading = true;
          this.productService
            .searchProducts(
              2,
              searchQuery,
              this.currentPage,
              this.pageSize,
              this.minValue,
              this.maxValue,
              this.selectedTypes['Proizvođač']
            )
            .subscribe((data: any) => {
              this.products = data?.items || data?.products || data?.content || [];
              this.totalProducts = data?.total || data?.totalCount || data?.totalElements || this.products.length;
              this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

              // Postavi inicijalne min/max cene ako backend šalje
              if (data?.minPrice !== undefined && this.initialMinValue === 0) {
                this.initialMinValue = data.minPrice;
                this.minValue = data.minPrice;
              }
              if (data?.maxPrice !== undefined && this.initialMaxValue === 0) {
                this.initialMaxValue = data.maxPrice;
                this.maxValue = data.maxPrice;
              }

              if (data?.manufacturerCounts) {
                this.filterCategories = [
                  {
                    category: 'Proizvođač',
                    types: Object.entries(data.manufacturerCounts).map(([name, quantity]) => ({
                      name,
                      quantity: quantity as number,
                    })),
                  },
                ];
              }

              this.updateVisiblePages();
              this.isLoading = false;
            });
          return;
        }

        if (isBrandRoute && brandNameFromBrandRoute) {
          this.ucitajBrend(brandNameFromBrandRoute);
          return;
        }

        // učitaj filtere
        if (this.glavnaGrupa) {
          this.productService
            .getProizvodjaciCount(
              2,
              this.glavnaGrupa,
              this.nadgrupa ? [this.nadgrupa] : [],
              this.minValue,
              this.maxValue,
              this.grupa
            )
            .subscribe((data) => {
              this.filterCategories = [
                {
                  category: 'Proizvođač',
                  types: Object.entries(data || {}).map(([name, quantity]) => ({
                    name,
                    quantity,
                  })),
                },
              ];
            });

          // učitaj nadgrupe ako je glavna grupa
          this.productService
            .getNadgrupeZaGrupu(this.glavnaGrupa)
            .subscribe((nadgrupe: string[]) => {
              this.subCategories = (nadgrupe || []).map((naziv) => ({
                name: this.utilService.formatirajNaziv(naziv),
                imgUrl: `assets/subcategories/${naziv}.jpg`,
              }));
            });

          // učitaj grupe ako si u nadgrupi
          if (this.nadgrupa && !this.grupa) {
            this.groups = this.getGrupeIzMockServisa(this.glavnaGrupa, this.nadgrupa);
          }
        }

        // učitaj proizvode
        if (this.grupa) {
          this.ucitajStranicuZaGrupu();
        } else if (this.nadgrupa && !this.grupa) {
          this.ucitajStranicuZaNadgrupu();
        } else if (this.glavnaGrupa) {
          this.ucitajStranicu();
        }

      }
    );
  }

  // 👇 NOVA METODA: dobavlja grupe iz mock servisa
  private getGrupeIzMockServisa(glavnaGrupa: string, nadgrupa: string): { name: string }[] {
    const all = this.mockService.getAllGlavneGrupe();
    const match = all.find(g => g.name.toUpperCase() === glavnaGrupa.toUpperCase());
    if (!match) { return []; }
    const groups = match.nadgrupe[nadgrupa.toUpperCase()] || [];
    return groups.map(name => ({ name: this.utilService.formatirajNaziv(name.trim()) }));
  }

  ucitajStranicu(): void {
    if (!this.glavnaGrupa) { return; }
    this.isLoading = true;

    this.productService
      .getProductsFromCategory(
        2,
        this.glavnaGrupa,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        this.selectedTypes.Proizvođač
      )
      .subscribe(
        (response) => {
          this.products = response.products;
          this.totalProducts = response.totalCount;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

          this.initialMinValue = response.initialMinCena;
          this.initialMaxValue = response.initialMaxCena;

          if (!this.minValue) { this.minValue = response.minCena; }
          if (!this.maxValue) { this.maxValue = response.maxCena; }

          this.updateVisiblePages();
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
  }

  ucitajStranicuZaGrupu(): void {
    if (!this.glavnaGrupa || !this.nadgrupa || !this.grupa) { return; }
    this.isLoading = true;

    const selektovaniProizvodjaci = this.selectedTypes.Proizvođač || [];

    this.productService
      .getProductsFromGrupa(
        2,
        this.glavnaGrupa,
        this.nadgrupa,
        this.grupa,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        selektovaniProizvodjaci
      )
      .subscribe(
        (response) => {
          this.products = response.products;
          this.totalProducts = response.totalCount;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          this.initialMinValue = response.initialMinCena;
          this.initialMaxValue = response.initialMaxCena;

          if (!this.minValue) { this.minValue = response.minCena; }
          if (!this.maxValue) { this.maxValue = response.maxCena; }
          this.updateVisiblePages();
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
  }


  ucitajStranicuZaNadgrupu(): void {
    if (!this.glavnaGrupa || !this.nadgrupa) { return; }
    this.isLoading = true;

    const selektovaniProizvodjaci = this.selectedTypes.Proizvođač || [];

    this.productService
      .getProductsFromNadgrupa(
        2,
        this.glavnaGrupa,
        this.nadgrupa,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        selektovaniProizvodjaci
      )
      .subscribe(
        (response) => {
          this.products = response.products;
          this.initialMinValue = response.initialMinCena;
          this.initialMaxValue = response.initialMaxCena;

          if (!this.minValue) { this.minValue = response.minCena; }
          if (!this.maxValue) { this.maxValue = response.maxCena; }
          this.totalProducts = response.totalCount;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          this.updateVisiblePages();
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
  }

  toggleCategory(category: string): void {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }

  isExpanded(category: string): boolean {
    return this.expandedCategories[category] || false;
  }

  updateVisiblePages(): void {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 6) {
      for (let i = 0; i < this.totalPages; i++) { pages.push(i); }
    } else {
      const lastPage = this.totalPages - 1;
      if (this.currentPage <= 2) {
        for (let i = 0; i <= 3; i++) { pages.push(i); }
        pages.push('...');
        pages.push(lastPage);
      } else if (this.currentPage >= lastPage - 2) {
        pages.push(0);
        pages.push('...');
        for (let i = lastPage - 3; i <= lastPage; i++) { pages.push(i); }
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      }
    }
    this.visiblePages = pages;
  }

  goToPage(page: number): void {
    if (typeof page === 'string') { return; }
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
    this.timeoutId = setTimeout(() => this.navigateWithFilters(), 300);
  }

  onTypeChange(category: string, type: string, isChecked: boolean) {
    if (!this.selectedTypes[category]) { this.selectedTypes[category] = []; }

    if (isChecked) {
      if (!this.selectedTypes[category].includes(type)) {
        this.selectedTypes[category].push(type);
      }
    } else {
      this.selectedTypes[category] = this.selectedTypes[category].filter(
        (t) => t !== type
      );
    }

    this.selectedTypes[category] = Array.from(new Set(this.selectedTypes[category]));
    this.navigateWithFilters();
  }

  navigateWithFilters() {
    const queryParams: any = {
      page: this.currentPage + 1,
      size: this.pageSize,
      minCena: this.minValue,
      maxCena: this.maxValue,
    };

    const proizvodjaci = this.selectedTypes.Proizvođač;
    if (proizvodjaci && proizvodjaci.length > 0) {
      queryParams.proizvodjaci = proizvodjaci.join(',');
    } else {
      queryParams.proizvodjaci = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  normalizeFileName(naziv: string): string {
    const mapaZamene: any = {
      š: 's', Š: 'S', ć: 'c', Ć: 'C', č: 'c', Č: 'C',
      đ: 'dj', Đ: 'Dj', ž: 'z', Ž: 'Z',
    };
    return naziv
      .split('')
      .map((char) => mapaZamene[char] || char)
      .join('')
      .toUpperCase();
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/noImageAvailable.jpg';
  }

  ucitajBrend(brand: string) {
    this.isLoading = true;

    this.productService.getProductsByBrand(2, brand).subscribe(response => {

      this.products = response;

      this.initialMinValue = response.initialMinCena;
      this.initialMaxValue = response.initialMaxCena;

      if (!this.minValue) { this.minValue = response.minCena; }
      if (!this.maxValue) { this.maxValue = response.maxCena; }

      this.totalProducts = response.length;
      this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
      this.updateVisiblePages();

      this.isLoading = false;
    });
  }

}
