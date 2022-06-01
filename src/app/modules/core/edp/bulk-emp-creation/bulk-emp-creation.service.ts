import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API } from './constants/bulk-emp-creation-api.constants';

@Injectable({
  providedIn: 'root'
})
export class BulkEmpCreationService {
  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getUploadedAttachmentList(param) {
    return this.httpClient.post(`${environment.baseUrl}${API.BEC_TRANSACTION.ATTACHMENTS.GET_UPLOADED_ATTACH}`, param);
  }

  attachmentUpload(param) {
    return this.httpClient.post(`${environment.baseUrl}${API.BEC_TRANSACTION.ATTACHMENTS.ATTACH_UPLOAD}`, param);
  }

  saveTransaction(param) {
    return this.httpClient.post(`${environment.baseUrl}${API.BEC_TRANSACTION.CREATE}`, param);
  }
  submitTransaction(param) {
    return this.httpClient.post(`${environment.baseUrl}${API.BEC_TRANSACTION.SUBMIT}`, param
    , { responseType: 'blob' as 'json' });
  }
  downloadAttachment(param) {
    return this.httpClient.post(`${environment.baseUrl}${API.BEC_TRANSACTION.SUBMIT}`,
      param, { responseType: 'blob' as 'json' });
  }
}
