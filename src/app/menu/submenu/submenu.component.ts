import { Component, Input } from '@angular/core';
import { GlavnaGrupa } from "../../services/mock-glavna-grupa.service";

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {
  @Input() glavnaGrupa: GlavnaGrupa;
  constructor() {
    console.log(this.glavnaGrupa);
  }
}
