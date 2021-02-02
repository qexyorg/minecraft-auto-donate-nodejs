import { Component, OnInit } from '@angular/core';
import { GlobalScopeService } from "../services/global-scope.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public globals: GlobalScopeService) { }

  ngOnInit(): void {
  }

}
