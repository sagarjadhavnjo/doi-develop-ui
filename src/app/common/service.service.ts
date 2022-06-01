import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  public rowData = new BehaviorSubject<any>('Hello');
  constructor() { }
  viewComments(data: any) {
    this.rowData.next(data);
  }
}
