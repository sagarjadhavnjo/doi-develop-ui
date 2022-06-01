import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-policy-printout-format',
  templateUrl: './policy-printout-format.component.html',
  styleUrls: ['./policy-printout-format.component.css']
})
export class PolicyPrintoutFormatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onPrint() {
    window.print();
  }

}
