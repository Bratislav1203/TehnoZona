import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { ProductrowComponent } from './product/productrow/productrow.component';
import { ProductcardComponent } from './product/productcard/productcard.component';
import { CategoryMenuComponent } from './menu/category-menu/category-menu.component';
import { FooterComponent } from './footer/footer.component';
import { AdBannerComponent } from './ad-banner/ad-banner.component';
import { HeaderBannerComponent } from './header/header-banner/header-banner.component';
import { ContentComponent } from './content/content.component';
import { SubmenuComponent } from './menu/submenu/submenu.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { AppRoutingModule } from "./app-routing.module";
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClientModule } from "@angular/common/http";
import { BrandComponent } from './brand/brand.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { CartComponent } from './pages/cart/cart.component';
import {CheckoutComponent} from "./pages/cart/checkout/checkout.component";
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TabBarComponent,
    ProductrowComponent,
    ProductcardComponent,
    CategoryMenuComponent,
    FooterComponent,
    AdBannerComponent,
    HeaderBannerComponent,
    ContentComponent,
    SubmenuComponent,
    ProductDetailsComponent,
    HomePageComponent,
    LoginPageComponent,
    BrandComponent,
    CategoryPageComponent,
    LoadingOverlayComponent,
    CartComponent,
    CheckoutComponent,
    AboutUsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
