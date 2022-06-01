import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ChequeCancellation, ChequeToChequeEffect } from './../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';


@Component({
  selector: 'app-cheque-to-cheque-effect-division-view',
  templateUrl: './cheque-to-cheque-effect-division-view.component.html',
  styleUrls: ['./cheque-to-cheque-effect-division-view.component.css']
})
export class ChequeToChequeEffectDivisionViewComponent implements OnInit {
    

    ChequeToChequeEffectData: ChequeToChequeEffect[] = [
    ];
  
    // Table Columns for Table Cheque to cheque Effect
    ChequeToChequeEffectDataColumn: string[] = [
      'chequeDt', 'chequeNumber', 'chequeAmnt', 'partyNamee'
    ];
  
  userName: any;
  subscribeParams: Subscription;
  mode: any;
  action: any;
  status: any;
  hdrId: any;
  bankId: any;
  toOrSubToId: any;
  sdId: any;
  epaySdId: any;
  isEditable: any;
  refNo: any;
  refDate: any;
  cancellationTableDate: any[] = [];
  todayDate = new Date();
  errorChequeNumber = false;
  errorMessage = lcMessage;
  wfRoleIds: any;
  wfRoleCode: any;
  menuId: any;
  linkMenuId: any;
  postId: any;
  userId: any;
  divisionId: any;
  lkPoOffUserId: any;
  officeId: any;
  attachmentTypeList: any[] = [];
  viewableExtension = ['pdf', 'jpg', 'jpeg', 'png'];
  selectedFilePreviewPdf: string;
  selectedFilePreviewImageBase64: string;
  selectedFileBase64: string;
  dData: any;
  showWorkFlowAction: boolean = true;
  maxAttachment: number;
  constant = EdpDataConst;
  fileBrowseIndex: number;
  totalAttachmentSize: number;


  brwoseData: any[] = [
    {
        name: undefined,
        file: undefined,
        uploadedBy: '',
        attachmentType: ''
    }
];
displayedBrowseColumns = [
  'position',
  'attachmentTypeId',
  'fileName',
  'browse',
  'uploadedFileName',
  'userName',
  'action'
];

  dataSourceBrowse = new MatTableDataSource(this.brwoseData);


  /**
     * Form Group Instance
     *
     * @type {FormGroup}
     * @memberOf ChequeCancelationDivisionViewComponent
     */
   chequeToChequeEffectForm: FormGroup;

  /**
   * Mat table instance
   *
   * @type {MatTableDataSource<any>}
   * @memberOf ChequeCancelationDivisionViewComponent
   */

   ChequeToChequeEffectDataSource = new MatTableDataSource<ChequeToChequeEffect>(this.ChequeToChequeEffectData)



  /**
   * Creates an instance of ChequeCancelationDivisionViewComponent.
   * @param {FormBuilder} fb
   * @param {LetterOfCreditService} locService
   * @param {StorageService} storageService
   * @param {CommonWorkflowService} commonWorkflowService
   * @param {ToastrService} toastr
   * @param {MatDialog} dialog
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   *
   * @memberOf ChequeCancelationDivisionViewComponent
   */

  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
    private locService: LetterOfCreditService, private commonWorkflowService: CommonWorkflowService, private storageService: StorageService,
    private toastr: ToastrService, private elem: ElementRef, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) { }
  /** 
    * Create object to access Methods of Letter of Credit Directive
    *
    **/


  
   @ViewChild('attachment', { static: true }) attachment: ElementRef;
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  /***********************Life cycle hooks methods start***********************************/


  /**
   * Life cycle hooks method
   *
   *
   * @memberOf ChequeCancelationDivisionViewComponent
   */


  ngOnInit() {
    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.mode = resRoute.mode;
      this.action = resRoute.action;
      this.status = resRoute.status;
      this.hdrId = resRoute.id;
      this.isEditable = resRoute.isEditable;
    });

    this.getCurrentUserDetail();

    this.chequeToChequeEffectFormData();
    if (this.mode == 'view') {
        this.chequeToChequeEditView();
      }
  }
  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/

  /**
   * Initialize formgroup
   *
   *
   * @memberOf ChequeCancelationDivisionViewComponent
   * 
   * 
   * 
   * 
   */



   chequeToChequeEffectFormData() {
    this.chequeToChequeEffectForm = this.fb.group({
      missingChequeNumber: [''],
      divisionCode: [''],
      chequeAmount: [''],
      chequeDate: [''],
      partyName: [''],
      adviceNo: [''],
      reason: [''],
      chequeDt  : [''],
      chequeNumber:[''],
      chequeAmnt :[''],
      partyNamee:['']

     
    });
  }


  
    /**
    *  Get login details and set to local configuration variables
    *
    * @private
    *
    * @memberOf LcAdviceReceivedComponent
    */
     private getCurrentUserDetail() {
      this.commonWorkflowService.getCurrentUserDetail().then((res: any) => {
        console.log(res, 'current user details')
        if (res) {
          this.wfRoleIds = res.wfRoleId;
          this.wfRoleCode = res.wfRoleCode;
          this.menuId = res.menuId
          this.linkMenuId = res.linkMenuId ? res.linkMenuId : this.menuId;
          this.postId = res.postId;
          this.userId = res.userId;
          this.lkPoOffUserId = res.lkPoOffUserId;
          this.officeId = res.officeDetail.officeId;
          this.getAttachmentList();

        }
      });
    }



  /**
    * call on View icon from listing page 
    * 
    * 
    * 
    * @memberof ChequeCancelationDivisionViewComponent 
    */

   chequeToChequeEditView(){
    const params = {

      hdrId: this.hdrId,    
      actionStatus: this.isEditable
    }
    this.locService.getData(params, APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.EDITVIEW_CHEQUECANCEL).subscribe((res: any) => {
      console.log("chequeEpayment");
      if (res && res.status === 200 && (res.result) != null ) {

        this.chequeToChequeEffectForm.patchValue({ divisionCode: res.result.divCode });
        this.chequeToChequeEffectForm.patchValue({ chequeAmount: res.result.chequeAmt });
        this.chequeToChequeEffectForm.patchValue({ chequeDate: (res.result.chequeDate) ? this.datepipe.transform(res.result.chequeDate, 'dd-MMM-yyyy')
        : res.result.chequeDate });
        this.chequeToChequeEffectForm.patchValue({ partyName: res.result.partyName });
        this.chequeToChequeEffectForm.patchValue({ adviceNo: res.result.adviceNo });
        this.chequeToChequeEffectForm.patchValue({ missingChequeNumber: res.result.chequeNO });
        this.chequeToChequeEffectForm.patchValue({ reason: res.result.remarks });
        this.hdrId = res.result.hdrId,
        this.refNo = res.result.refNo;
        this.refDate = (res.result.refDate) ? this.datepipe.transform(res.result.refDate,'dd-MMM-yyyy HH:mm') :'';
        res.result.chqList.forEach(value => {
          value.isGenerateChequeNo = true;
          console.log(value.chequeDate)
          value.chequeDate = new Date(value.chequeDate)
          value.chequeNo = value.chequeNo
        })
     
          this.ChequeToChequeEffectDataSource = new MatTableDataSource(res.result.chqList);
        

      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  /**
*
* Get totalHeadWiseAmount Calculation
* @return {*}
* @memberof ChequeCancelationDivisionViewComponent 
*/

totalChequeAmount(): number {
    let amount = 0;
    // tslint:disable-next-line:no-shadowed-variable
    this.ChequeToChequeEffectDataSource.data.forEach(element => {
      amount = amount + Number(element.chequeAmnt);
    });
    return amount;
  }


  
   /**
     * @description Method to get attachment types.
     * @returns array object
     */
    getAttachmentList() {
      const param = {
          categoryName: 'TRANSACTION',
          menuId: this.linkMenuId
      };
      this.commonWorkflowService.getAttachmentList(param).subscribe(
          (res: any) => {
              if (res && res.status === 200 && res.result && res.result.length > 0) {
                  this.attachmentTypeList = res.result.filter(data => {
                      data.id = data['attTypeId'].id;
                      data.name = data['attTypeId'].name;
                      data.isMandatory = data['attTypeId'].isMandatory;
                      data.category = data['attTypeId'].category;
                      return data;
                  });

                  this.getUploadedAttachmentData();
              }
          },
          err => {
              this.toastr.error(err);
          }
      );
  }

  /**
   * @description Method to get user uploaded attachments.
   * @returns array object
   */
  getUploadedAttachmentData() {
      try {
          this.dataSourceBrowse = new MatTableDataSource([]);
          const param = {
              categoryName: 'TRANSACTION',
              menuId: this.linkMenuId,
              trnId: this.hdrId,
              lkPOUId: this.lkPoOffUserId
          };
          this.commonWorkflowService.getUploadedAttachmentList(param).subscribe(
              (res: any) => {
                  if (res && res.status === 200 && res.result) {
                      const resultObject = _.cloneDeep(res.result);
                      if (resultObject.length === 0) {
                          if (this.mode !== 'view') {
                          this.addNewFileRow();
                          }
                      } else {
                          let extension;
                          resultObject.filter(data => {
                              extension = data.uploadedFileName ? data.uploadedFileName.split('.').pop() : '';
                              if (this.constant.viewableExtension.indexOf(extension) !== -1) {
                                  data.isView = true;
                              }
                              return data;
                          });
                          this.dataSourceBrowse.data = _.cloneDeep(resultObject);
                      }
                  }
              },
              err => {
                  this.toastr.error(err);
              }
          );
      } catch (error) {
          this.toastr.error(error);
      }
  }

  /**
   * @description Add row for adding attachment
   */
  addNewFileRow() {
      if (this.dataSourceBrowse && this.dataSourceBrowse.data.length > 0) {
          const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
          const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
          if (data && data.attachmentTypeId && data.fileName && data.uploadedFileName) {
              const p_data = this.dataSourceBrowse.data;
              p_data.push({
                  attachmentId: 0,
                  attachmentTypeId: getCurrentFileTypeInfo.id,
                  attachmentTypeName: getCurrentFileTypeInfo.name,
                  file: '',
                  fileName: '',
                  uploadDirectoryPath: getCurrentFileTypeInfo.uploadDirectoryPath,
                  uploadedFileName: '',
                  fileSize: getCurrentFileTypeInfo.fileSize,
                  format: getCurrentFileTypeInfo.format,
                  menuId: getCurrentFileTypeInfo.menuId,
                  attCtegryId: getCurrentFileTypeInfo.attCtegryId,
                  userName: this.userName
              });

              this.dataSourceBrowse.data = p_data;
          } else {
              this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_ALL_DATA);
          }
      } else {
          const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
          const tableData = [
              {
                  attachmentId: 0,
                  attachmentTypeId: getCurrentFileTypeInfo.id,
                  attachmentTypeName: getCurrentFileTypeInfo.name,
                  file: '',
                  fileName: '',
                  uploadDirectoryPath: getCurrentFileTypeInfo.uploadDirectoryPath,
                  uploadedFileName: '',
                  fileSize: getCurrentFileTypeInfo.fileSize,
                  format: getCurrentFileTypeInfo.format,
                  menuId: getCurrentFileTypeInfo.menuId,
                  attCtegryId: getCurrentFileTypeInfo.attCtegryId,
                  userName: this.userName
              }
          ];
          this.dataSourceBrowse = new MatTableDataSource(tableData);
      }
  }

  /**
   * @description Get seleted attachment type
   */
  getSelectedFileTypeData(id?) {
      if (id) {
          return this.attachmentTypeList.find(ele => ele.id === id);
      } else {
          return this.attachmentTypeList[0] ? this.attachmentTypeList[0] : {};
      }
  }

    /**
     * @description Set the data on selection of file
     * @param object item
     * @param number index
     */
     onAttachmentTypeChange(item, index) {
      try {
          const getCurrentFileTypeInfo = this.getSelectedFileTypeData(item.attachmentId);
          this.dataSourceBrowse.data.forEach((data, indexTable) => {
              if (indexTable === index) {
                  data['fileName'] = '';
                  data['uploadDirectoryPath'] = getCurrentFileTypeInfo.uploadDirectoryPath;
                  data['fileSize'] = getCurrentFileTypeInfo.fileSize;
                  data['format'] = getCurrentFileTypeInfo.format;
                  data['menuId'] = getCurrentFileTypeInfo.menuId;
                  data['attCtegryId'] = getCurrentFileTypeInfo.attCtegryId;
                  data['file'] = null;
                  data['uploadedFileName'] = '';
                  data['fileExtension'] = '';
                  data['uploadedFileSize'] = 0;
              }
          });
      } catch (error) {
          this.toastr.error(error);
      }
  }

  /**
   * @description Check if it is mandatory to upload a file
   * @returns boolean flag
   */
  checkForMandatory() {
      let flag = true;
      this.dataSourceBrowse.data.forEach(obj => {
          if (obj.isMandatory === 'YES') {
              if (obj.id === 0) {
                  flag = false;
              }
          }
      });
      if (!flag) {
          this.toastr.error(MESSAGES.ATTACHMENT.PLEASE_ATTACH);
      }
      return flag;
  }

  /**
   * @description Save/Upload Attachment Details
   * @returns void
   */
  saveAttachmentTab() {
      let valid = true;
      const formData = new FormData();
      const filesArray = this.dataSourceBrowse.data.filter(item => item.attachmentId === 0 && item.file);
      if (filesArray.length === 0 && this.dataSourceBrowse.data.length !== 5) {
          this.toastr.error(MESSAGES.ATTACHMENT.ATLEAST_ONE_UPLOAD);
          valid = false;
      } else if (filesArray.length === 0 && this.dataSourceBrowse.data.length === 5) {
          this.toastr.error(MESSAGES.ATTACHMENT.ALREADY_UPLOADED);
          valid = false;
      } else {
          filesArray.forEach(element => {
              if (
                  !(
                      element.file &&
                      element.file !== '' &&
                      element.fileName &&
                      element.fileName !== '' &&
                      element.attachmentTypeId
                  )
              ) {
                  valid = false;
              }
          });
          if (!valid) {
              this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_DATA);
          }
      }

      if (valid) {
          filesArray.forEach((element, index) => {
              const categoryInfo = this.attachmentTypeList.filter(ele => ele.id === element.attachmentTypeId)[0];
              formData.append('attachmentCommonDtoList[' + index + '].eventId', '');
              formData.append('attachmentCommonDtoList[' + index + '].uploadedFileSize', element.uploadedFileSize);
              formData.append('attachmentCommonDtoList[' + index + '].userName', this.userName);
              formData.append('attachmentCommonDtoList[' + index + '].attachmentTypeId', element.attachmentTypeId);
              formData.append('attachmentCommonDtoList[' + index + '].categoryId', categoryInfo.category);
              formData.append('attachmentCommonDtoList[' + index + '].fileName', element.fileName);
              formData.append('attachmentCommonDtoList[' + index + '].fileSize', element.fileSize);
              formData.append('attachmentCommonDtoList[' + index + '].format', element.fileExtension);
              formData.append('attachmentCommonDtoList[' + index + '].lkPOUId', this.lkPoOffUserId);
              formData.append('attachmentCommonDtoList[' + index + '].menuId', this.linkMenuId);
              formData.append('attachmentCommonDtoList[' + index + '].trnId', this.hdrId);
              formData.append('attachmentCommonDtoList[' + index + '].userId', this.userId);
              formData.append(
                  'attachmentCommonDtoList[' + index + '].uploadDirectoryPath',
                  element.uploadDirectoryPath
              );
              formData.append('attachmentCommonDtoList[' + index + '].attachment', element.file, element.file.name);
              formData.append('attachmentCommonDtoList[' + index + '].uploadedFileName', element.uploadedFileName);
          });
          this.commonWorkflowService.attachmentUpload(formData).subscribe(
              (res: any) => {
                  if (res && res.status === 200) {
                      this.toastr.success(MESSAGES.ATTACHMENT.UPLOAD_SUCCESS);
                      this.getUploadedAttachmentData();
                  } else {
                      this.toastr.error(res.message);
                  }
              },
              err => {
                  this.toastr.error(err);
              }
          );
      }
  }

  /**
   * @description View Attachment
   * @param attachment  attachment
   */
  viewUploadedAttachment(attachment: any, event, isPreview = false) {
      try {
          const param = {
              documentDataKey: attachment.documentId,
              fileName: attachment.uploadedFileName
          };
          this.commonWorkflowService.viewAttachment(param).subscribe(
              (res: any) => {
                  if (res) {
                      const resultObj = res.result;
                      const imgNameArray = attachment.uploadedFileName.split('.');
                      const imgType = imgNameArray[imgNameArray.length - 1].trim();
                      let docType;
                      let isPdf = false;

                      switch (imgType) {
                          case 'pdf':
                              docType = 'application/pdf';
                              isPdf = true;
                              break;
                          case 'png':
                              docType = 'image/png';
                              break;

                          case 'jpg':
                              docType = 'image/jpg';
                              break;

                          case 'jpeg':
                          default:
                              docType = 'image/jpeg';
                              break;
                      }


                      if (isPreview === true) {
                          this.selectedFilePreviewImageBase64 = '';
                          this.selectedFilePreviewPdf = '';
                          const blobData = resultObj['fileSrc'] as string;
                          if (isPdf) {
                              this.selectedFilePreviewPdf = 'data:' + docType + ';base64,' + blobData;
                          } else {
                              this.selectedFilePreviewImageBase64 = 'data:' + docType + ';base64,' + blobData;
                          }
                          event.stopPropagation();
                      } else {
                          const byteArray = new Uint8Array(
                              atob(resultObj['fileSrc'])
                                  .split('')
                                  .map(char => char.charCodeAt(0))
                          );
                          const blob = new Blob([byteArray], { type: docType });
                          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                              window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
                          } else {
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, '_blank');
                          }
                      }
                  }
              },
              err => {
                  this.toastr.error(err);
              }
          );
      } catch (error) {
          this.toastr.error(error);
      }
  }

  /**
   * @description Download Attachment
   * @param params attachment details
   */
  downLoadUploadedAttachment(params) {
      try {
          const ID = {
              documentDataKey: params.documentId,
              fileName: params.uploadedFileName
          };
          this.commonWorkflowService.downloadAttachment(ID).subscribe(
              res => {
                  const url = window.URL.createObjectURL(res);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', '' + params.uploadedFileName);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
              },
              err => {
                  this.toastr.error(err);
              }
          );
      } catch (error) {
          this.toastr.error(error);
      }
  }

  /**
   * @description Open file selector
   */
  openFileSelector(index: number) {
      this.el.nativeElement.querySelector('#fileBrowse').click();
      this.fileBrowseIndex = index;
  }

  /**
   * @description Validate File on file selection
   * @param fileSelected selected file
   */
  onFileSelection(fileSelected: any) {
      let valid = true;
      const fileExtension = fileSelected.target.files[0].name
          .split('.')
          .pop()
          .toLowerCase();
      const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
      const fileSupportedExtension = this.dataSourceBrowse.data[this.fileBrowseIndex].format;
      const extensionArray = fileSupportedExtension.split(',');
      if (fileSelected.target.files[0].size > EdpDataConst.MAX_FILE_SIZE_FOR_COMMON * 1024) {
          valid = false;
          // const sizeInMB = BudgetConst.MAX_FILE_SIZE_FOR_COMMON / 1024;
          this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILE_SIZE);
      } else if (extensionArray.indexOf(fileExtension) < 0) {
          valid = false;
          this.toastr.error(MESSAGES.ATTACHMENT.ERROR_EXTENSION + extensionArray);
      }
      if (valid) {
          this.totalAttachmentSize += fileSizeInKb;
          this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
          this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = fileSelected.target.files[0].name;
          this.dataSourceBrowse.data[this.fileBrowseIndex].fileExtension = fileExtension.toLowerCase();
          this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileSize = fileSizeInKb;
      }
      this.attachment.nativeElement.value = '';
  }

  /**
   * @description This method remove the attached file from data table.
   * @param item Array from which index is to be found
   * @param index key based on which index is to be found
   */
  removeUploadUserFile(item,index) {
      this.dataSourceBrowse.data.forEach((data, indexTable) => {
          if (indexTable === index) {
              data['file'] = null;
              data['uploadedFileName'] = '';
              data['fileExtension'] = '';
              data['uploadedFileSize'] = 0;
          }
      });
  }

  /**
   * @description Method to find array index
   * @param itemArray Array from which index is to be found
   * @param keyName key based on which index is to be found
   * @param selectedValue selected value based on which index is to be found
   * @returns array object
   */
  deleteUploadedAttachment(item, index) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '360px',
          data: MESSAGES.ATTACHMENT.DELETE_FILE
      });
      dialogRef.afterClosed().subscribe(confirmationResult => {
          if (confirmationResult === 'yes') {
              if (item && item.uploadedFileName && item.uploadedDate && item.attachmentId) {
                  const param = {
                      attachmentId: item.attachmentId,
                      menuId: this.linkMenuId
                  };
                  this.commonWorkflowService.attachmentDelete(param).subscribe(
                      (res: any) => {
                          if (res && res.status === 200 && res.result === true) {
                              this.toastr.success(res.message);
                              this.dataSourceBrowse.data.splice(index, 1);
                              this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                              if (this.dataSourceBrowse.data.length === 0) {
                                  this.getUploadedAttachmentData();
                              }
                          }
                      },
                      err => {
                          this.toastr.error(err);
                      }
                  );
              } else {
                  this.dataSourceBrowse.data.splice(index, 1);
                  this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
              }
          }
      });
  }

  /**
* @description Method  is know the result status for all apis
* @params result fetched from th backend 
 
*/

  checkSucessApiResponse(res: any) {
      if (res && res.status === 200 && res.result.length > 0) {
          return 1;
      } else if (res && res.status === 200 && (res.result == null || res.result.length == 0)) {
          res['message'] = 'No Record Found';
          return 2;
      } else if (res && res.status !== 200) {
          return 3;
      }
  }
  /**
* @description Method  is to fetch list of majorheads  for details for AG tab
 
*/

}
