import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HbaService {

  constructor(private httpClient: HttpClient) { }

  postHbaClaimEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
     private showError(toastr: ToastrService, error: any) {
      toastr.error(error);
  }

  postHbaClaimListing(url: string, id: number, status: number,) {

    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  deleteHbaClaimListing(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  }

  postHbaClaimLossDtEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  postHbaClaimLossDtListing(url: string, id: number, status: number,) {

    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  deleteHbaClaimLossDt(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  }


  postHbaClaimRejectEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
     
  postHbaClaimRejectListing(url: string, id: number, status: number,) {

    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  deleteHbaClaimReject(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  }



  postHbaClaimWfEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  postHbaClaimWfListing(url: string, id: number, status: number,) {

    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  deleteHbaClaimWf(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  } 



postHbaOthrCompClaimEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  postHbaOthrCompClaimfListing(url: string, id: number, status: number,) {

    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  deleteHbaOthrCompClaim(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  } 



  postHbaProposalEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  postHbaProposalListing(url: string) {

    return this.httpClient.post(`${environment.baseUrl}${url}`, {});
  }
    
  deleteTdoiHbaProposal(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  } 



  postHbaProposlWflEntry(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }

  postTHbaProposlWfListing(url: string, id: number, status: number,) {

    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }
    
  deleteHbaProposlWf(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  } 

}
