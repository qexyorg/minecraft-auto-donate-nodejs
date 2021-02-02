import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalScopeService {
  public options: any = {};
  public clients: number = 0;
  public last: any = [];

  constructor() { }
}
