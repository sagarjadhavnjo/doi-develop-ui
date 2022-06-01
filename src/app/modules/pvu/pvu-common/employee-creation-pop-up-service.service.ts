import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeCreationPopUpServiceService {

  private empiD: number = 0;

  constructor() {
    this.empiD = 0;
  }

  set empID(id) {
    this.empiD = id;
  }

  get empID() {
    return this.empiD;
  }

}
