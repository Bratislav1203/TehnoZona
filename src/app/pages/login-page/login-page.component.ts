import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [
    trigger('formAnimation', [
      state('login', style({
        opacity: 1,
        transform: 'translateX(0)',
      })),
      state('register', style({
        opacity: 1,
        transform: 'translateX(0)',
      })),
      transition('login => register', [
        animate('0.5s ease', style({ opacity: 0, transform: 'translateX(-100%)' })),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition('register => login', [
        animate('0.5s ease', style({ opacity: 0, transform: 'translateX(100%)' })),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ]
})
export class LoginPageComponent {
  showRegisterForm = false;

  get formState() {
    return this.showRegisterForm ? 'register' : 'login';
  }

  toggleForm(event: Event) {
    event.preventDefault(); // Sprečava ponovno učitavanje stranice
    this.showRegisterForm = !this.showRegisterForm;
  }
}
