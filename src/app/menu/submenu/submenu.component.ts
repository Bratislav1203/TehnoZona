import { Component, Input } from '@angular/core';
import { GlavnaGrupa } from "../../services/mock-glavna-grupa.service";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {
  @Input() glavnaGrupa: GlavnaGrupa;
  constructor(public utilService: UtilService) {
    console.log(this.glavnaGrupa);
  }
}
