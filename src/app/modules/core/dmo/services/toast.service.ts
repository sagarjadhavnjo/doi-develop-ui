import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastMsgService {
  dpObj: any;
  constructor(private _toast: ToastrService) { }

  /**
   * DP list API called here
   * @param reqObj 
   * @returns 
   */
  success(msg) {
    this._toast.success(msg);
  }

  error(msg) {
    this._toast.error(msg);
  }
}