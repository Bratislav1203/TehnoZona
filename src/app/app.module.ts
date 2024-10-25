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
    SubmenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
