import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/modules/services/common.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {
  private userLoggedIn = false;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

}
