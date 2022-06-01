import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/modules/services/common.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  private userLoggedIn = false;
  @Input() showSpinner = false;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

}
