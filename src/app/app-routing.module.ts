import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from "./product/product-details/product-details.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'auth', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
