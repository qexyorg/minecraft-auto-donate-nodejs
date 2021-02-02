import { Component, OnInit } from '@angular/core';
import {GlobalScopeService} from "../services/global-scope.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public globals: GlobalScopeService) { }

  ngOnInit(): void {
  }

}
