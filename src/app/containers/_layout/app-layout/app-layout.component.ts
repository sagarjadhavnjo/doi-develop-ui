import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { CommonService } from './../../../modules/services/common.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  @ViewChild('toggleContainer', { static: true }) toggleContainer: ElementRef;
  // @ViewChild('formContainer') formContainer: ElementRef;

  constructor(
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    // For checking if menuu is open while routed to any menu
    const DOMToken: DOMTokenList = this.toggleContainer.nativeElement.classList;
    if (this.router.url !== '/dashboard' && DOMToken && !DOMToken.contains('toggle-bar')) {
      this.onMenuToggle(true);
    }
    this.commonService.getConditionalIds();
  }

  onMenuToggle(data) {
    // this.sideBar.nativeElement.classList.add('test')
    // this.sideBar.nativeElement.classList.remove('test')
    this.toggleContainer.nativeElement.classList.toggle('toggle-bar');

  }
}
