import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from "./product/product-details/product-details.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";
import { CartComponent } from "./pages/cart/cart.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'auth', component: LoginPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'categoryPage/:brandName', component: CategoryPageComponent },
  { path: ':glavnaGrupa', component: CategoryPageComponent },
  { path: ':glavnaGrupa/:nadgrupa', component: CategoryPageComponent },
  { path: ':glavnaGrupa/:nadgrupa/:grupa', component: CategoryPageComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
