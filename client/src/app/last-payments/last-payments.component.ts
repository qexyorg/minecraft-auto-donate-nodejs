import {Component, OnInit} from '@angular/core';
import {GlobalScopeService} from "../services/global-scope.service";

@Component({
  selector: 'app-last-payments',
  templateUrl: './last-payments.component.html',
  styleUrls: ['./last-payments.component.css']
})
export class LastPaymentsComponent implements OnInit {

  constructor(public globals: GlobalScopeService) { }

  ngOnInit(): void {
  }

}
