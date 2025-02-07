import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from "./product/product-details/product-details.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { CategoryPageComponent } from "./pages/category-page/category-page.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'categoryPage', component: CategoryPageComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'auth', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
