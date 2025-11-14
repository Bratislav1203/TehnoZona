import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from "./product/product-details/product-details.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { CartComponent } from "./pages/cart/cart.component";
import { CheckoutComponent } from "./pages/cart/checkout/checkout.component";
import { AboutUsPageComponent } from "./pages/about-us-page/about-us-page.component";
import {AdminLoginComponent} from "./admin/admin-login/admin-login.component";
import {AdminDashboardComponent} from "./admin/admin-dashboard/admin-dashboard.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'x9frk2n7pb4qm8stj5h0', component: AdminLoginComponent },
  { path: 'x9frk2n7pb4qm8stj5h0/dashboard', component: AdminDashboardComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'auth', component: LoginPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'aboutTehnoZona', component: AboutUsPageComponent },
  { path: 'categoryPage/brand/:brandName', component: CategoryPageComponent },
  { path: 'search/:query', component: CategoryPageComponent },
  { path: ':glavnaGrupa', component: CategoryPageComponent },
  { path: ':glavnaGrupa/:nadgrupa', component: CategoryPageComponent },
  { path: ':glavnaGrupa/:nadgrupa/:grupa', component: CategoryPageComponent },
  { path: 'search=:query', component: CategoryPageComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
