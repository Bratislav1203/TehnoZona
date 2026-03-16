import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FilterCategory, Product, ProductService, nameAndImage, NadgrupaExtended } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { UtilService } from '../../services/util.service';
import { MockGlavnaGrupaService } from '../../services/mock-glavna-grupa.service';
import { environment } from '../../../environments/environment';

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
  isSubCategoriesLoading = false;
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
  sort = '';

  lastBrand: string | null = null;
  lastCategory: { glavna: string | null, nad: string | null, grupa: string | null } = { glavna: null, nad: null, grupa: null };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public utilService: UtilService,
    private mockService: MockGlavnaGrupaService // 👈 novi servis
  ) { }

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParams, this.route.url]).subscribe(
      ([params, queryParams, urlSegments]) => {
        const segs = urlSegments.map(s => s.path);
        const isSearchRoute = params.has('query');
        const searchQuery = params.get('query');

        const isBrandRoute =
          segs.length >= 3 &&
          segs[0] === 'categoryPage' &&
          segs[1] === 'brand';
        const brandNameFromBrandRoute = isBrandRoute ? segs[2] : null;

        // Detekcija promene rute za resetovanje opsega cena
        const currentBrand = isBrandRoute ? brandNameFromBrandRoute : null;
        const brandChanged = currentBrand !== this.lastBrand;
        const currentGlavna = params.get('glavnaGrupa');
        const glavnaGrupaChanged = this.lastCategory.glavna !== currentGlavna;

        const categoryChanged =
          glavnaGrupaChanged ||
          this.lastCategory.nad !== (params.get('nadgrupa')?.toUpperCase() || null) ||
          this.lastCategory.grupa !== params.get('grupa');

        if (brandChanged || categoryChanged) {
          this.initialMinValue = 0;
          this.initialMaxValue = 0;
          this.minValue = 0;
          this.maxValue = 0;
          this.selectedTypes['Proizvođač'] = []; // Resetuj i proizvođače pri promeni kategorije
          this.lastBrand = currentBrand;
          this.lastCategory = {
            glavna: params.get('glavnaGrupa'),
            nad: params.get('nadgrupa')?.toUpperCase() || null,
            grupa: params.get('grupa')
          };
        }

        this.title = params.get('brandName') || currentBrand || '';
        this.glavnaGrupa = params.get('glavnaGrupa');
        this.nadgrupa = params.get('nadgrupa')?.toUpperCase() || null;
        this.grupa = params.get('grupa');

        // Query parametri (uvek imaju prioritet ako su u URL-u)
        this.currentPage = (+queryParams.page || 1) - 1;
        this.pageSize = +queryParams.size || 20;

        if (queryParams.minCena !== undefined) this.minValue = +queryParams.minCena;
        if (queryParams.maxCena !== undefined) this.maxValue = +queryParams.maxCena;

        const proizvodjaciParam = queryParams.proizvodjaci;

        if (proizvodjaciParam) {
          this.selectedTypes['Proizvođač'] = (Array.isArray(proizvodjaciParam) ? proizvodjaciParam : [proizvodjaciParam]).map(p => p.toUpperCase());
        } else {
          this.selectedTypes['Proizvođač'] = [];
        }

        this.sort = queryParams.sort || '';

        if (isSearchRoute && searchQuery) {
          this.searchFilter = searchQuery;
          this.isLoading = true;
          console.log(`📡 Gadjam: GET /api/vendors/1/search?q=${searchQuery}&sort=${this.sort}`);
          this.productService
            .searchProducts(
              0,
              searchQuery,
              this.currentPage,
              this.pageSize,
              this.minValue,
              this.maxValue,
              this.selectedTypes['Proizvođač'],
              this.sort
            )
            .subscribe((data: any) => {
              this.products = data?.items || data?.products || data?.content || [];
              this.totalProducts = data?.total || data?.totalCount || data?.totalElements || this.products.length;
              this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

              // Postavi inicijalne min/max cene ako backend šalje i ako već nisu postavljene
              const bMin = data?.initialMinCena ?? data?.minPrice ?? data?.minCena;
              const bMax = data?.initialMaxCena ?? data?.maxPrice ?? data?.maxCena;

              if (bMin !== undefined && this.initialMinValue === 0) {
                this.initialMinValue = bMin;
                if (!this.minValue) this.minValue = bMin;
              }
              if (bMax !== undefined && this.initialMaxValue === 0) {
                this.initialMaxValue = bMax;
                if (!this.maxValue) this.maxValue = bMax;
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
              } else {
                // Ako backend ne vrati counts, isprazni listu filtera
                this.filterCategories = [];
              }

              this.updateVisiblePages();
              this.isLoading = false;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          return;
        }

        if (isBrandRoute && brandNameFromBrandRoute) {
          this.ucitajBrend(brandNameFromBrandRoute);
          return;
        }

        // Reset search filter ako nismo na search ruti
        this.searchFilter = '';

        if (this.glavnaGrupa) {
          // Osveži nadgrupe SAMO ako se glavna grupa promenila
          if (glavnaGrupaChanged || this.subCategories.length === 0) {
            this.isSubCategoriesLoading = true;
            this.subCategories = []; // 👈 odmah isprazni stare nadgrupe
            this.productService
              .getNadgrupeExtendedZaGrupu(this.glavnaGrupa)
              .subscribe({
                next: (nadgrupe: NadgrupaExtended[]) => {
                  this.subCategories = (nadgrupe || []).map((ng) => ({
                    name: this.utilService.formatirajNaziv(ng.name),
                    imgUrl: `assets/subcategories/${ng.name}.jpg`,
                    fallbackUrl: ng.image
                  }));
                  this.isSubCategoriesLoading = false;
                },
                error: () => this.isSubCategoriesLoading = false
              });
          }

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
    console.log(`📡 Gadjam: GET /api/vendors/1/glavnaGrupa/${this.glavnaGrupa}/artikli?sort=${this.sort}`);

    this.productService
      .getProductsFromCategory(
        0,
        this.glavnaGrupa,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        this.selectedTypes['Proizvođač'],
        this.sort
      )
      .subscribe(
        (data: any) => {
          this.products = data?.items || data?.products || data?.content || [];
          this.totalProducts = data?.total || data?.totalCount || data?.totalElements || this.products.length;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

          // Postavi cene reaktivno
          const bMin = data?.initialMinCena ?? data?.minPrice ?? data?.minCena;
          const bMax = data?.initialMaxCena ?? data?.maxPrice ?? data?.maxCena;

          if (bMin !== undefined && (this.initialMinValue === 0 || !this.minValue)) {
            this.initialMinValue = bMin;
            this.minValue = bMin;
          }
          if (bMax !== undefined && (this.initialMaxValue === 0 || !this.maxValue)) {
            this.initialMaxValue = bMax;
            this.maxValue = bMax;
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        () => (this.isLoading = false)
      );
  }

  ucitajStranicuZaGrupu(): void {
    if (!this.glavnaGrupa || !this.nadgrupa || !this.grupa) { return; }
    this.isLoading = true;
    console.log(`📡 Gadjam: GET /api/vendors/1/glavnaGrupa/${this.glavnaGrupa}/nadgrupa/${this.nadgrupa}/grupa/${this.grupa}/artikli?sort=${this.sort}`);

    const selektovaniProizvodjaci = this.selectedTypes['Proizvođač'] || [];

    this.productService
      .getProductsFromGrupa(
        0,
        this.glavnaGrupa,
        this.nadgrupa,
        this.grupa,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        selektovaniProizvodjaci,
        this.sort
      )
      .subscribe(
        (data: any) => {
          this.products = data?.items || data?.products || data?.content || [];
          this.totalProducts = data?.total || data?.totalCount || data?.totalElements || this.products.length;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

          const bMin = data?.initialMinCena ?? data?.minPrice ?? data?.minCena;
          const bMax = data?.initialMaxCena ?? data?.maxPrice ?? data?.maxCena;

          if (bMin !== undefined && (this.initialMinValue === 0 || !this.minValue)) {
            this.initialMinValue = bMin;
            this.minValue = bMin;
          }
          if (bMax !== undefined && (this.initialMaxValue === 0 || !this.maxValue)) {
            this.initialMaxValue = bMax;
            this.maxValue = bMax;
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        () => (this.isLoading = false)
      );
  }


  ucitajStranicuZaNadgrupu(): void {
    if (!this.glavnaGrupa || !this.nadgrupa) { return; }
    this.isLoading = true;
    console.log(`📡 Gadjam: GET /api/vendors/1/glavnaGrupa/${this.glavnaGrupa}/nadgrupa/${this.nadgrupa}/artikli?sort=${this.sort}`);

    const selektovaniProizvodjaci = this.selectedTypes['Proizvođač'] || [];

    this.productService
      .getProductsFromNadgrupa(
        0,
        this.glavnaGrupa,
        this.nadgrupa,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        selektovaniProizvodjaci,
        this.sort
      )
      .subscribe(
        (data: any) => {
          this.products = data?.items || data?.products || data?.content || [];
          this.totalProducts = data?.total || data?.totalCount || data?.totalElements || this.products.length;
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

          const bMin = data?.initialMinCena ?? data?.minPrice ?? data?.minCena;
          const bMax = data?.initialMaxCena ?? data?.maxPrice ?? data?.maxCena;

          if (bMin !== undefined && (this.initialMinValue === 0 || !this.minValue)) {
            this.initialMinValue = bMin;
            this.minValue = bMin;
          }
          if (bMax !== undefined && (this.initialMaxValue === 0 || !this.maxValue)) {
            this.initialMaxValue = bMax;
            this.maxValue = bMax;
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
    this.timeoutId = setTimeout(() => {
      this.currentPage = 0;
      this.navigateWithFilters();
    }, 300);
  }

  onTypeChange(category: string, type: string, isChecked: boolean) {
    if (!this.selectedTypes[category]) { this.selectedTypes[category] = []; }

    if (isChecked) {
      if (!this.selectedTypes[category].map(t => t.toUpperCase()).includes(type.toUpperCase())) {
        this.selectedTypes[category].push(type.toUpperCase());
      }
    } else {
      this.selectedTypes[category] = this.selectedTypes[category].filter(
        (t) => t.toUpperCase() !== type.toUpperCase()
      );
    }

    this.selectedTypes[category] = Array.from(new Set(this.selectedTypes[category]));

    this.currentPage = 0;
    this.navigateWithFilters();
  }

  onSortChange(newSort: string) {
    console.log('🔀 Sort promenjen:', newSort);
    this.sort = newSort;
    this.currentPage = 0;
    this.navigateWithFilters();
  }

  isTypeSelected(category: string, name: string): boolean {
    return this.selectedTypes[category]?.some(t => t.toUpperCase() === name.toUpperCase()) || false;
  }

  navigateWithFilters() {
    const queryParams: any = {
      page: this.currentPage + 1,
      size: this.pageSize,
      minCena: this.minValue,
      maxCena: this.maxValue,
    };

    const proizvodjaci = this.selectedTypes['Proizvođač'];
    if (proizvodjaci && proizvodjaci.length > 0) {
      queryParams.proizvodjaci = proizvodjaci;
    } else {
      queryParams.proizvodjaci = null; // null uklanja iz URL-a pri merge
    }

    if (this.sort) {
      queryParams.sort = this.sort;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,

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

  onImageError(event: Event, subCategory?: nameAndImage) {
    const element = event.target as HTMLImageElement;
    if (subCategory && subCategory.fallbackUrl && element.src.indexOf(subCategory.fallbackUrl) === -1) {
      // Prepend apiBaseUrl to fallbackUrl if it's a relative path starting with /api
      const baseUrl = environment.apiBaseUrl.endsWith('/') ? environment.apiBaseUrl.slice(0, -1) : environment.apiBaseUrl;
      element.src = baseUrl + subCategory.fallbackUrl;
    } else {
      element.src = 'assets/noImageAvailable.jpg';
    }
  }

  resetFilters() {
    this.minValue = 0;
    this.maxValue = 0;
    this.initialMinValue = 0;
    this.initialMaxValue = 0;
    this.selectedTypes = {};
    this.searchFilter = '';
    this.currentPage = 0;
    this.router.navigate(['/']);
  }

  ucitajBrend(brand: string) {
    this.isLoading = true;
    console.log(`📡 Gadjam: GET /api/vendors/1/artikli/brand/${brand}?sort=${this.sort}`);

    this.productService
      .getProductsByBrand(
        0,
        brand,
        this.currentPage,
        this.pageSize,
        this.minValue,
        this.maxValue,
        this.sort
      )
      .subscribe((data: any) => {
        // Handle both flat array (old backend) and ProductPageResponse object (new backend)
        if (Array.isArray(data)) {
          this.products = data;
          this.totalProducts = data.length;
        } else {
          this.products = data?.products || [];
          this.totalProducts = data?.totalCount || this.products.length;
        }
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);

        // Postavi inicijalne min/max cene (ProductPageResponse format)
        const bMin = data?.minCena;
        const bMax = data?.maxCena;

        if (bMin !== undefined && (this.initialMinValue === 0 || !this.minValue)) {
          this.initialMinValue = bMin;
          this.minValue = bMin;
        }
        if (bMax !== undefined && (this.initialMaxValue === 0 || !this.maxValue)) {
          this.initialMaxValue = bMax;
          this.maxValue = bMax;
        }

        this.updateVisiblePages();
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

}
