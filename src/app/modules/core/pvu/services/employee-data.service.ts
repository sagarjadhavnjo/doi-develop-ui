import * as _ from 'lodash';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

const NO_CHANGE = 0;
const UPDATE_RECORD = 1;
const NEW_RECORD = 2;
const DELETE_RECORD = 3;
@Injectable({
    providedIn: 'root'
})
export class EmployeeDataService {

    private employeeDto;
    private qualificationDto;
    private departmentDto;
    skipkeys = ['dateOfJoining', 'dateOfRetirement', 'deathTerminationDate', 'deputationStartDate',
    'deputationEndDate', 'deathTerminationDate', 'dateOfPassing', 'dateOfExam', 'orderDate',
    'fromDate', 'toDate', 'dateOfJoiningGOG', 'fixPayDate'];
    deleteKeys = ['cccExamNameDisable', 'cccExamNameList', 'langNameList', 'langTypeList'
    , 'updatedDate', 'createdDate', 'updatedByPost', 'createdByPost', 'formAction', 'createdBy', 'updatedBy',
    'changeType'];
    ignoreKeys = [];

    constructor(@Inject(LOCALE_ID) private locale: string) {
        this.employeeDto = {};
        this.qualificationDto = {};
        this.departmentDto = {};
    }

    set employeeDTO(data) {
        this.employeeDto = data;
    }

    set qualificationDTO(data) {
        this.qualificationDto = data;
    }

    set departmentDTO(data) {
        this.departmentDto = data;
    }

    checkEmployeeDtoDifference(data) {
        const empDto = {};
        if (this.employeeDto) {
            if (this.employeeDto['pvuEmployeNomineeDto']) {
                const pvuEmployeNomineeDto = this.checkPvuEmployeNomineeDtoDifference(data['pvuEmployeNomineeDto']);
                if (pvuEmployeNomineeDto) {
                    empDto['pvuEmployeNomineeDto'] = pvuEmployeNomineeDto;
                }
            }
        }
        return empDto;
    }

    checkPvuEmployeDtoDifference(newPvuEmployeDto) {
        const oldPvuEmployeDto = _.cloneDeep(this.employeeDto['pvuEmployeDto']);
        if ((+oldPvuEmployeDto['nationality'] !== +newPvuEmployeDto['nationality'])
        || (+oldPvuEmployeDto['salutation'] !== +newPvuEmployeDto['salutation'])
        || (oldPvuEmployeDto['employeeName'] !== newPvuEmployeDto['employeeName'])
        || (this.setNumberToString(oldPvuEmployeDto['employeeMiddleName']) !==
        newPvuEmployeDto['employeeMiddleName'])
        || (this.setNumberToString(oldPvuEmployeDto['employeeSurname']) !==
        newPvuEmployeDto['employeeSurname'])
        || (+oldPvuEmployeDto['gender'] !== +newPvuEmployeDto['gender'])
        || (this.dateFormating(oldPvuEmployeDto['dateOfBirth']).toString() !==
        this.dateFormating(newPvuEmployeDto['dateOfBirth']).toString())
        || (this.setNumberToString(oldPvuEmployeDto['emailID']) !== newPvuEmployeDto['emailID'])
        || (oldPvuEmployeDto['mobileNo'] !== newPvuEmployeDto['mobileNo'])
        || (oldPvuEmployeDto['fatherName'] !== newPvuEmployeDto['fatherName'])
        || (oldPvuEmployeDto['motherName'] !== newPvuEmployeDto['motherName'])
        || (+oldPvuEmployeDto['maritalStatus'] !== +newPvuEmployeDto['maritalStatus'])
        || (+oldPvuEmployeDto['category'] !== +newPvuEmployeDto['category'])
        || (oldPvuEmployeDto['religion'] !== newPvuEmployeDto['religion'])
        || (oldPvuEmployeDto['caste'] !== newPvuEmployeDto['caste'])
        || (+oldPvuEmployeDto['bloodGroup'] !== +newPvuEmployeDto['bloodGroup'])
        || (+oldPvuEmployeDto['phStatus'] !== +newPvuEmployeDto['phStatus'])
        || (((+oldPvuEmployeDto['phType'] !== +newPvuEmployeDto['phType'])) &&
        ((+oldPvuEmployeDto['phStatus'] !== 1) && (+newPvuEmployeDto['phStatus'] !== 1)))
        || (this.setNumberToString(oldPvuEmployeDto['otherPhCategory']) !==
        newPvuEmployeDto['otherPhCategory'])
        || (this.dateFormating(oldPvuEmployeDto['dateOfMedFitnessCert']).toString() !==
        this.dateFormating(newPvuEmployeDto['dateOfMedFitnessCert']).toString())
        || (oldPvuEmployeDto['identificationMark'] !== newPvuEmployeDto['identificationMark'])
        || (+oldPvuEmployeDto['height'] !== +newPvuEmployeDto['height'])
        || (this.setNumberToString(oldPvuEmployeDto['electionCardNo']) !==
        newPvuEmployeDto['electionCardNo'])
        || (this.setNumberToString(oldPvuEmployeDto['aadhaarNo']) !== newPvuEmployeDto['aadhaarNo'])
        || (this.setNumberToString(oldPvuEmployeDto['panNo']) !== newPvuEmployeDto['panNo'])
        || (this.setNumberToString(oldPvuEmployeDto['passportNo']) !== newPvuEmployeDto['passportNo'])
        || (this.dateFormating(oldPvuEmployeDto['passportExpiryDate']).toString() !==
        this.dateFormating(newPvuEmployeDto['passportExpiryDate']).toString())
        || (this.setNumberToString(oldPvuEmployeDto['buckleNo']) !== newPvuEmployeDto['buckleNo'])
        ) {
            return UPDATE_RECORD;
        }
        return 0;
    }

    checkEmpAddrDtoDifference(newPvuEmployeAddressDto) {
        const oldPvuEmployeAddressDto = _.cloneDeep(this.employeeDto['pvuEmployeAddressDto']);
        if ((oldPvuEmployeAddressDto['curAddress1'] !== newPvuEmployeAddressDto['curAddress1'])
        || (oldPvuEmployeAddressDto['curAddress2'] !== newPvuEmployeAddressDto['curAddress2'])
        || (+oldPvuEmployeAddressDto['curState'] !== +newPvuEmployeAddressDto['curState'])
        || (+oldPvuEmployeAddressDto['curDistrict'] !== +newPvuEmployeAddressDto['curDistrict'])
        || (+oldPvuEmployeAddressDto['curTaluka'] !== +newPvuEmployeAddressDto['curTaluka'])
        || (oldPvuEmployeAddressDto['curOtherTaluka'] !== newPvuEmployeAddressDto['curOtherTaluka'])
        || (oldPvuEmployeAddressDto['curCity'] !== newPvuEmployeAddressDto['curCity'])
        || (oldPvuEmployeAddressDto['curPinCode'] !== newPvuEmployeAddressDto['curPinCode'])
        || (+oldPvuEmployeAddressDto['curOfficeDist'] !== +newPvuEmployeAddressDto['curOfficeDist'])
        || (oldPvuEmployeAddressDto['perAddress1'] !== newPvuEmployeAddressDto['perAddress1'])
        || (oldPvuEmployeAddressDto['perAddress2'] !== newPvuEmployeAddressDto['perAddress2'])
        || (+oldPvuEmployeAddressDto['perState'] !== +newPvuEmployeAddressDto['perState'])
        || (+oldPvuEmployeAddressDto['perDistrict'] !== +newPvuEmployeAddressDto['perDistrict'])
        || (+oldPvuEmployeAddressDto['perTaluka'] !== +newPvuEmployeAddressDto['perTaluka'])
        || (oldPvuEmployeAddressDto['perOtherTaluka'] !== newPvuEmployeAddressDto['perOtherTaluka'])
        || (oldPvuEmployeAddressDto['perCity'] !== newPvuEmployeAddressDto['perCity'])
        || (oldPvuEmployeAddressDto['perPinCode'] !== newPvuEmployeAddressDto['perPinCode'])
        || (oldPvuEmployeAddressDto['natAddress1'] !== newPvuEmployeAddressDto['natAddress1'])
        || (oldPvuEmployeAddressDto['natAddress2'] !== newPvuEmployeAddressDto['natAddress2'])
        || (+oldPvuEmployeAddressDto['natState'] !== +newPvuEmployeAddressDto['natState'])
        || (+oldPvuEmployeAddressDto['natDistrict'] !== +newPvuEmployeAddressDto['natDistrict'])
        || (+oldPvuEmployeAddressDto['natTaluka'] !== +newPvuEmployeAddressDto['natTaluka'])
        || (oldPvuEmployeAddressDto['natOtherTaluka'] !== newPvuEmployeAddressDto['natOtherTaluka'])
        || (oldPvuEmployeAddressDto['natCity'] !== newPvuEmployeAddressDto['natCity'])
        || (oldPvuEmployeAddressDto['natPinCode'] !== newPvuEmployeAddressDto['natPinCode'])
        ) {
            return UPDATE_RECORD;
        }
        return 0;
    }

    checkPvuEmployeNomineeDtoDifference(newPvuEmployeNomineeDto) {
        const oldPvuEmployeNomineeDto = _.cloneDeep(this.employeeDto['pvuEmployeNomineeDto']);
        if (oldPvuEmployeNomineeDto.length > 0) {
            for (let i = 0; i < newPvuEmployeNomineeDto.length; i++) {
                const newNominee = newPvuEmployeNomineeDto[i];
                if (newNominee['empNomineeId'] && Number(newNominee['empNomineeId']) !== 0) {
                    if ((newNominee
                    && (Number(newNominee['changeType']) !== DELETE_RECORD)) || !newNominee['changeType']) {
                        const oldNomObj = oldPvuEmployeNomineeDto.filter((oldNom) => {
                            return oldNom['empNomineeId'] === newNominee['empNomineeId'];
                        });
                        if (oldNomObj && oldNomObj.length === 1) {
                            if ((+oldNomObj[0]['relationship'] !== +newNominee['relationship'])
                            || (oldNomObj[0]['otherRelationship'] !== newNominee['otherRelationship'])
                            || (oldNomObj[0]['nomineeName'] !== newNominee['nomineeName'])
                            || (oldNomObj[0]['nomineeAddress'] !== newNominee['nomineeAddress'])
                            || (oldNomObj[0]['nomineeAge'] !== newNominee['nomineeAge'])
                            || (oldNomObj[0]['nomineeShare'] !== newNominee['nomineeShare'])
                            || (oldNomObj[0]['photoOfNominee'] && newNominee['photoOfNominee'] &&
                            (oldNomObj[0]['photoOfNominee']['name'] !== newNominee['photoOfNominee']['name']))
                            || (oldNomObj[0]['nomineePhoto'] !== newNominee['nomineePhoto'])
                            || (oldNomObj[0]['genNomiForm'] && newNominee[0]['genNomiForm'] &&
                            (oldNomObj[0]['genNomiForm']['name'] !== newNominee['genNomiForm']['name']))
                            || (oldNomObj[0]['genNomineePhoto'] !== newNominee['genNomineePhoto'])
                            || (oldNomObj[0]['npsNomiForm'] && newNominee['npsNomiForm'] &&
                            (oldNomObj[0]['npsNomiForm']['name'] !== newNominee['npsNomiForm']['name']))
                            || (oldNomObj[0]['npsNomineePhoto'] !== newNominee['npsNomineePhoto'])) {
                                newPvuEmployeNomineeDto[i]['changeType'] = UPDATE_RECORD;
                            } else {
                                newPvuEmployeNomineeDto[i]['changeType'] = 0;
                            }
                        }
                    }
                } else {
                    newPvuEmployeNomineeDto[i]['changeType'] = NEW_RECORD;
                }
            }
        }
        return newPvuEmployeNomineeDto;
    }

    checkQualificationDtoDifference(data, arr) {
        if (this.qualificationDto) {
            if (this.qualificationDto['pvuEmployeQualificationDto']) {
                this.checkPvuEmpQualDtoDifference(_.cloneDeep(data['pvuEmployeQualificationDto']), arr);
            }
            arr.push({ key : 'qualificationDto.exemptedDeptExamFlag', value : data['exemptedDeptExamFlag']});
            if (this.qualificationDto['exemptedDeptExamFlag'] !== data['exemptedDeptExamFlag']) {
                arr.push({ key : 'qualificationDto.exemptedDeptExam.changeType', value : UPDATE_RECORD});
                if ( data['exemptedDeptExamFlag']) {
                    if (data['exemptedDeptExam']) {
                        this.setFormData(arr , 'qualificationDto.exemptedDeptExam',
                        data['exemptedDeptExam']);
                        arr.push({key: 'qualificationDto.exemptedDeptExam.changeType',
                            value: NEW_RECORD});
                    }
                } else {
                    if (data['pvuEmployeDeptExamDetailsDto'] && data['pvuEmployeDeptExamDetailsDto'].length > 0) {
                        for (let i = 0; i < data['pvuEmployeDeptExamDetailsDto'].length; i++) {
                            this.setFormDataArray(arr, 'qualificationDto.pvuEmployeDeptExamDetailsDto',
                            i, _.cloneDeep(data['pvuEmployeDeptExamDetailsDto'][i]));
                            arr.push({ key : 'qualificationDto.pvuEmployeDeptExamDetailsDto[' + i + '].changeType'
                            , value : NEW_RECORD});
                        }
                    }
                }
            } else {
                if (data['exemptedDeptExamFlag']) {
                    arr.push({ key: 'qualificationDto.exemptedDeptExam.empDeptExamDetailId',
                    value : data['exemptedDeptExam']['empDeptExamDetailId'] });
                    arr.push({ key: 'qualificationDto.exemptedDeptExam.empId',
                    value : data['exemptedDeptExam']['empId'] });
                    arr.push({ key: 'qualificationDto.exemptedDeptExam.remarks',
                    value: data['exemptedDeptExam']['remarks']});
                    if (data['exemptedDeptExam']['remarks'] !== this.qualificationDto['exemptedDeptExam']['remarks']) {
                        arr.push({ key: 'qualificationDto.exemptedDeptExam.changeType', value: UPDATE_RECORD});
                    } else {
                        arr.push({ key: 'qualificationDto.exemptedDeptExam.changeType', value: NO_CHANGE});
                    }
                } else {
                    arr.push({ key : 'qualificationDto.exemptedDeptExam.changeType', value : NO_CHANGE});
                    if (data['pvuEmployeDeptExamDetailsDto'] && data['pvuEmployeDeptExamDetailsDto'].length > 0) {
                        for (let i = 0; i < data['pvuEmployeDeptExamDetailsDto'].length; i++) {
                            const newDeptExam = data['pvuEmployeDeptExamDetailsDto'][i];
                            if (newDeptExam['empDeptExamDetailId']) {
                                if (this.qualificationDto['pvuEmployeDeptExamDetailsDto']) {
                                    // tslint:disable-next-line:max-line-length
                                    const oldDeptExam = this.qualificationDto['pvuEmployeDeptExamDetailsDto'].filter((examObj) => {
                                        return examObj['empDeptExamDetailId'] === newDeptExam['empDeptExamDetailId'];
                                    });
                                    if (oldDeptExam && oldDeptExam.length === 1) {
                                        this.setFormDataArray(arr, 'qualificationDto.pvuEmployeDeptExamDetailsDto',
                                        i, newDeptExam);
                                        if ((oldDeptExam[0]['deptExamName'] !== newDeptExam['deptExamName'])
                                        || (+oldDeptExam[0]['examBody'] !== +newDeptExam['examBody'])
                                        || (+oldDeptExam[0]['deptHodName'] !== +newDeptExam['deptHodName'])
                                        || (oldDeptExam[0]['otherDeptHodName'] !== newDeptExam['otherDeptHodName'])
                                        || (this.dateFormating(oldDeptExam[0]['dateOfPassing']).toString() !==
                                        this.dateFormating(newDeptExam['dateOfPassing']).toString())
                                        || (+oldDeptExam[0]['examStatus'] !== +newDeptExam['examStatus'])
                                        || (+oldDeptExam[0]['examAttempts'] !== +newDeptExam['examAttempts'])
                                        || (oldDeptExam[0]['remarks'] !== newDeptExam['remarks'])
                                        ) {
                                            arr.push(
                                                {
                                                    // tslint:disable-next-line:max-line-length
                                                    key : 'qualificationDto.pvuEmployeDeptExamDetailsDto[' + i + '].changeType',
                                                    value: UPDATE_RECORD
                                                });
                                        } else {
                                            arr.push(
                                                {
                                                    // tslint:disable-next-line:max-line-length
                                                    key: 'qualificationDto.pvuEmployeDeptExamDetailsDto[' + i + '].changeType',
                                                    value: NO_CHANGE
                                                });
                                        }
                                    }
                                }
                            } else {
                                this.setFormDataArray(arr, 'qualificationDto.pvuEmployeDeptExamDetailsDto',
                                        i, newDeptExam);
                                arr.push({key: 'qualificationDto.pvuEmployeDeptExamDetailsDto[' + i + '].changeType'
                                , value: NEW_RECORD});
                            }
                        }
                    }
                }
            }
            arr.push({key: 'qualificationDto.exemptedCccExamFlag', value: data['exemptedCccExamFlag']});
            if (this.qualificationDto['exemptedCccExamFlag'] !== data['exemptedCccExamFlag']) {
                arr.push({key: 'qualificationDto.exemptedCccExam.changeType', value: UPDATE_RECORD});
                    if ( data['exemptedCccExamFlag']) {
                        if (data['exemptedCccExam']) {
                            this.setFormData(arr , 'qualificationDto.exemptedCccExam',
                            data['exemptedCccExam']);
                            arr.push({key: 'qualificationDto.exemptedCccExam.changeType',
                                value: NEW_RECORD});
                        }
                    } else {
                        if (data['pvuEmployeCCCExamDetailDto'] && data['pvuEmployeCCCExamDetailDto'].length > 0) {
                            for (let i = 0; i < data['pvuEmployeCCCExamDetailDto'].length; i++) {
                                this.setFormDataArray(arr, 'qualificationDto.pvuEmployeCCCExamDetailDto',
                                i , data['pvuEmployeCCCExamDetailDto'][i]);
                                arr.push({key: 'qualificationDto.pvuEmployeCCCExamDetailDto[' + i + '].changeType',
                                value: NEW_RECORD});
                            }
                        }
                    }
            } else {
                if (data['exemptedCccExamFlag']) {
                    arr.push({ key: 'qualificationDto.exemptedCccExam.empCCCExamDetailId',
                    value : data['exemptedCccExam']['empCCCExamDetailId'] });
                    arr.push({ key: 'qualificationDto.exemptedCccExam.empId',
                    value : data['exemptedCccExam']['empId'] });
                    arr.push({ key: 'qualificationDto.exemptedCccExam.remarks',
                    value: data['exemptedCccExam']['remarks']});
                    if (data['exemptedCccExam']['remarks'] !== this.qualificationDto['exemptedCccExam']['remarks']) {
                        arr.push({key: 'qualificationDto.exemptedCccExam.changeType', value: UPDATE_RECORD});
                    } else {
                        arr.push({key: 'qualificationDto.exemptedCccExam.changeType', value: NO_CHANGE});
                    }
                } else {
                    arr.push({key: 'qualificationDto.exemptedCccExam.changeType', value: NO_CHANGE});
                    if (data['pvuEmployeCCCExamDetailDto'] && data['pvuEmployeCCCExamDetailDto'].length > 0) {
                        for (let i = 0; i < data['pvuEmployeCCCExamDetailDto'].length; i++) {
                            const newDeptExam = data['pvuEmployeCCCExamDetailDto'][i];
                            if (newDeptExam['empCCCExamDetailId']) {
                                if (this.qualificationDto['pvuEmployeCCCExamDetailDto']) {
                                    // tslint:disable-next-line:max-line-length
                                    const oldDeptExam = this.qualificationDto['pvuEmployeCCCExamDetailDto'].filter((examObj) => {
                                        return examObj['empCCCExamDetailId'] === newDeptExam['empCCCExamDetailId'];
                                    });
                                    if (oldDeptExam && oldDeptExam.length === 1) {
                                        this.setFormDataArray(arr, 'qualificationDto.pvuEmployeCCCExamDetailDto',
                                        i, newDeptExam);
                                        if ((oldDeptExam[0]['cccExamName'] !== newDeptExam['cccExamName'])
                                        || (oldDeptExam[0]['examBody'] !== newDeptExam['examBody'])
                                        || (this.dateFormating(oldDeptExam[0]['dateOfExam']).toString() !==
                                        this.dateFormating(newDeptExam['dateOfExam']).toString())
                                        || (this.dateFormating(oldDeptExam[0]['dateOfPassing']).toString() !==
                                        this.dateFormating(newDeptExam['dateOfPassing']).toString())
                                        || (oldDeptExam[0]['examStatus'] !== newDeptExam['examStatus'])
                                        || (oldDeptExam[0]['certificateNo'] !== newDeptExam['certificateNo'])
                                        || (oldDeptExam[0]['remarks'] !== newDeptExam['remarks'])
                                        ) {
                                            arr.push(
                                                {
                                                    // tslint:disable-next-line:max-line-length
                                                    key: 'qualificationDto.pvuEmployeCCCExamDetailDto[' + i + '].changeType',
                                                    value : UPDATE_RECORD
                                                });
                                        } else {
                                            arr.push(
                                                {
                                                    // tslint:disable-next-line:max-line-length
                                                    key: 'qualificationDto.pvuEmployeCCCExamDetailDto[' + i + '].changeType',
                                                    value : NO_CHANGE
                                                });
                                        }
                                    }
                                }
                            } else {
                                this.setFormDataArray(arr, 'qualificationDto.pvuEmployeCCCExamDetailDto',
                                i, newDeptExam);
                                arr.push({key: 'qualificationDto.pvuEmployeCCCExamDetailDto[' + i + '].changeType',
                                value: NEW_RECORD});
                            }
                        }
                    }
                }
            }
            if (this.qualificationDto['pvuEmployeLangExamDto']) {
               this.checkPvuEmplLangExamDtoDifference(_.cloneDeep(data['pvuEmployeLangExamDto']), arr);
            }
        }
    }

    checkPvuEmpQualDtoDifference(newPvuEmpQualDto, arr) {
        const oldPvuEmpQualDto = _.cloneDeep(this.qualificationDto['pvuEmployeQualificationDto']);
        if (oldPvuEmpQualDto.length > 0) {
            for (let i = 0; i < newPvuEmpQualDto.length; i++) {
                const newQual = newPvuEmpQualDto[i];
                if (newQual['empQualiId']) {
                    const oldQual = oldPvuEmpQualDto.filter((oldempQual) => {
                        return oldempQual['empQualiId'] === newQual['empQualiId'];
                    });
                    if (oldQual && oldQual.length === 1) {
                       this.setFormDataArray(arr, 'qualificationDto.pvuEmployeQualificationDto', i , newQual);
                        if ((oldQual[0]['degree'] !== newQual['degree'])
                        || (this.setNumberToString(oldQual[0]['courseName']) !==
                        this.setNumberToString(newQual['courseName']))
                        || (this.setNumberToString(oldQual[0]['otherCourseName']) !==
                        this.setNumberToString(newQual['otherCourseName']))
                        || (oldQual[0]['passingYear'] !== newQual['passingYear'])
                        || (oldQual[0]['schoolCollege'] !== newQual['schoolCollege'])
                        || (oldQual[0]['universityBoard'] !== newQual['universityBoard'])
                        || (oldQual[0]['percentageCGPA'] !== newQual['percentageCGPA'])
                        || (oldQual[0]['remarks'] !== newQual['remarks'])
                        ) {
                            arr.push({key: 'qualificationDto.pvuEmployeQualificationDto[' + i + '].changeType',
                            value: UPDATE_RECORD});
                        } else {
                            arr.push({key: 'qualificationDto.pvuEmployeQualificationDto[' + i + '].changeType',
                            value: NO_CHANGE});
                        }
                    }
                } else {
                    this.setFormDataArray(arr, 'qualificationDto.pvuEmployeQualificationDto' , i, newQual);
                    arr.push({key: 'qualificationDto.pvuEmployeQualificationDto[' + i + '].changeType',
                    value: NEW_RECORD});
                }
            }
        }
    }

    checkPvuEmplLangExamDtoDifference(newPvuEmpLangDto, arr) {
        const oldPvuEmpLangDto = _.cloneDeep(this.qualificationDto['pvuEmployeLangExamDto']);
        if (oldPvuEmpLangDto.length > 0) {
            for (let i = 0; i < newPvuEmpLangDto.length; i++) {
                const newLang = newPvuEmpLangDto[i];
                if (newLang['empLangExamId']) {
                    const oldLang = oldPvuEmpLangDto.filter((oldempLang) => {
                        return oldempLang['empLangExamId'] === newLang['empLangExamId'];
                    });
                    if (oldLang && oldLang.length === 1) {
                        this.setFormDataArray(arr, 'qualificationDto.pvuEmployeLangExamDto',
                        i, newLang);
                        if ((oldLang[0]['langName'] !== newLang['langName'])
                        || (oldLang[0]['examBody'] !== newLang['examBody'])
                        || (oldLang[0]['examType'] !== newLang['examType'])
                        || (this.dateFormating(oldLang[0]['dateOfPassing']).toString() !==
                        this.dateFormating(newLang['dateOfPassing']).toString())
                        || (oldLang[0]['seatNo'] !== newLang['seatNo'])
                        || (oldLang[0]['examStatus'] !== newLang['examStatus'])
                        || (oldLang[0]['remarks'] !== newLang['remarks'])
                        ) {
                        arr.push({key: 'qualificationDto.pvuEmployeLangExamDto[' + i + '].changeType',
                        value: UPDATE_RECORD});
                        } else {
                            arr.push({key: 'qualificationDto.pvuEmployeLangExamDto[' + i + '].changeType',
                            value: NO_CHANGE});
                        }
                    }
                } else {
                    this.setFormDataArray(arr , 'qualificationDto.pvuEmployeLangExamDto',
                        i, newLang);
                    arr.push({key: 'qualificationDto.pvuEmployeLangExamDto[' + i + '].changeType',
                    value: NEW_RECORD});
                }
            }
        }
    }

    checkEmplDepartmentDtoDiff(newPvuEmployeDepartmentDto, arr) {
        const oldPvuEmployeDepartmentDto = _.cloneDeep(this.departmentDto['pvuEmployeDepartmentDto']);
        this.setFormData(arr, 'departmentDto.pvuEmployeDepartmentDto', newPvuEmployeDepartmentDto);
        if ((this.dateFormating(oldPvuEmployeDepartmentDto['dateOfJoiningGOG']).toString()
        !== this.dateFormating(newPvuEmployeDepartmentDto['dateOfJoiningGOG']).toString())
        || (this.dateFormating(oldPvuEmployeDepartmentDto['dateOfRetirement']).toString()
        !== this.dateFormating(newPvuEmployeDepartmentDto['dateOfRetirement']).toString())
        || (+oldPvuEmployeDepartmentDto['empStatus'] !== +newPvuEmployeDepartmentDto['empStatus'])
        || (+oldPvuEmployeDepartmentDto['deputation'] !== +newPvuEmployeDepartmentDto['deputation'])
        || (+oldPvuEmployeDepartmentDto['empPayType'] !== +newPvuEmployeDepartmentDto['empPayType'])
        || (+oldPvuEmployeDepartmentDto['designationId'] !== +newPvuEmployeDepartmentDto['designationId'])
        || (+oldPvuEmployeDepartmentDto['subOffice'] !== +newPvuEmployeDepartmentDto['subOffice'])
        || (+oldPvuEmployeDepartmentDto['empClass'] !== +newPvuEmployeDepartmentDto['empClass'])
        || (+oldPvuEmployeDepartmentDto['empType'] !== +newPvuEmployeDepartmentDto['empType'])
        || (oldPvuEmployeDepartmentDto['station'] !== newPvuEmployeDepartmentDto['station'])
        || (+oldPvuEmployeDepartmentDto['taluka'] !== +newPvuEmployeDepartmentDto['taluka'])
        || (+oldPvuEmployeDepartmentDto['parentHeadDeptId'] !== +newPvuEmployeDepartmentDto['parentHeadDeptId'])
        || (+oldPvuEmployeDepartmentDto['isNPA'] !== +newPvuEmployeDepartmentDto['isNPA'])
        || (+oldPvuEmployeDepartmentDto['hodNameId'] !== +newPvuEmployeDepartmentDto['hodNameId'])
        || (oldPvuEmployeDepartmentDto['gpfNo'] !== newPvuEmployeDepartmentDto['gpfNo'])
        || (oldPvuEmployeDepartmentDto['pranAccNo'] !== newPvuEmployeDepartmentDto['pranAccNo'])
        || (oldPvuEmployeDepartmentDto['ppoNo'] !== newPvuEmployeDepartmentDto['ppoNo'])
        || (oldPvuEmployeDepartmentDto['ppanNo'] !== newPvuEmployeDepartmentDto['ppanNo'])
        || (this.dateFormating(oldPvuEmployeDepartmentDto['deputationStartDate']).toString()
        !== this.dateFormating(newPvuEmployeDepartmentDto['deputationStartDate']).toString())
        || (this.dateFormating(oldPvuEmployeDepartmentDto['deputationEndDate']).toString()
        !== this.dateFormating(newPvuEmployeDepartmentDto['deputationEndDate']).toString())
        // tslint:disable-next-line:max-line-length
        || (this.dateFormating(oldPvuEmployeDepartmentDto['deathTerminationDate']).toString() !== this.dateFormating(newPvuEmployeDepartmentDto['deathTerminationDate']).toString())
        || (+oldPvuEmployeDepartmentDto['deputation'] !== newPvuEmployeDepartmentDto['deputation'])
        || (+oldPvuEmployeDepartmentDto['deputDistrictId'] !== newPvuEmployeDepartmentDto['deputDistrictId'])
        || (+oldPvuEmployeDepartmentDto['deputDdoCode'] !== newPvuEmployeDepartmentDto['deputDdoCode'])
        || (+oldPvuEmployeDepartmentDto['deputCardexNo'] !== newPvuEmployeDepartmentDto['deputCardexNo'])
        || (+oldPvuEmployeDepartmentDto['deputOfficeId'] !== newPvuEmployeDepartmentDto['deputOfficeId'])
        || (this.dateFormating(oldPvuEmployeDepartmentDto['fixPayDate']).toString()
        !== this.dateFormating(newPvuEmployeDepartmentDto['fixPayDate']).toString())) {
            arr.push({key: 'departmentDto.pvuEmployeDepartmentDto.changeType', value: UPDATE_RECORD});
        } else {
            arr.push({key: 'departmentDto.pvuEmployeDepartmentDto.changeType', value: NO_CHANGE});
        }
    }

    checkEmplHistoryDiff(newPvuEmplHistoryDto, arr) {
        const oldPvuEmplHistoryDto = _.cloneDeep(this.departmentDto['pvuEmployeHistoryDto']);
        if (newPvuEmplHistoryDto && newPvuEmplHistoryDto.length > 0) {
            for (let i = 0; i < newPvuEmplHistoryDto.length; i++) {
                const newEmpHist = _.cloneDeep(newPvuEmplHistoryDto[i]);
                if (!newEmpHist['employeHistroyId'] || newEmpHist['employeHistroyId'] === 0) {
                    arr.push({key: 'departmentDto.pvuEmployeHistoryDto[' + i + '].changeType', value: NEW_RECORD});
                } else {
                    if (newEmpHist && (Number(newEmpHist['changeType']) === DELETE_RECORD)) {
                        arr.push({key: 'departmentDto.pvuEmployeHistoryDto[' + i + '].changeType',
                        value: DELETE_RECORD});
                    } else {
                        const oldEmpHistory = oldPvuEmplHistoryDto.filter((ele) => {
                            return Number(ele.employeHistroyId) === Number(newEmpHist.employeHistroyId);
                        });
                        if (oldEmpHistory && oldEmpHistory.length > 0) {
                            if ((+oldEmpHistory[0]['employementType'] !== +newEmpHist['employementType'])
                            || (oldEmpHistory[0]['deptName'] !== newEmpHist['deptName'])
                            || (oldEmpHistory[0]['officeName'] !== newEmpHist['officeName'])
                            || (oldEmpHistory[0]['officeAdd'] !== newEmpHist['officeAdd'])
                            || (oldEmpHistory[0]['empDesignationHist'] !== newEmpHist['empDesignationHist'])
                            || (this.dateFormating(oldEmpHistory[0]['fromDate']).toString() !==
                            this.dateFormating(newEmpHist['fromDate']).toString())
                            || (this.dateFormating(oldEmpHistory[0]['toDate']).toString() !==
                            this.dateFormating(newEmpHist['toDate']).toString())
                            || (oldEmpHistory[0]['lastPayDrawn'] !== newEmpHist['lastPayDrawn'])
                            || (+oldEmpHistory[0]['empServiceContinuation'] !== +newEmpHist['empServiceContinuation'])
                            || (oldEmpHistory[0]['orderNoDate'] !== newEmpHist['orderNoDate'])) {
                                arr.push({key: 'departmentDto.pvuEmployeHistoryDto[' + i + '].changeType',
                                value: UPDATE_RECORD});
                            } else {
                                arr.push({key: 'departmentDto.pvuEmployeHistoryDto[' + i + '].changeType',
                                value: NO_CHANGE});
                            }
                        }
                    }
                }
                this.setFormDataArray(arr, 'departmentDto.pvuEmployeHistoryDto', i , newEmpHist);
            }
        }
    }

    setDeleteType(data) {
        data['changeType'] = DELETE_RECORD;
        return data;
    }

    setNumberToString(value) {
        return value === '0' || value === 0 ? '' : value;
    }

    /**
     * @description To convert the string format date in a date object
     * @param date date value
     */
    dateFormating(date) {
        if (date !== 0 && date !== '' && date != null) {
            let d;
            if ( !(date instanceof Date) && date.split('').length !== 10) {
                if (date.indexOf('T') !== -1) {
                    d = date.split('T')[0].split('-');
                } else if (date.indexOf(' ') !== -1) {
                    d = date.split(' ')[0].split('-');
                } else {
                    d = date.split('-');
                }
                d = new Date(d[0], Number(d[1]) - 1, d[2]);
                return d;
            } else {
                d = new Date(date);
                return new Date(d.getFullYear(), d.getMonth(), d.getDate());
            }
        }
        return '';
    }

      /**
     * @description To convert the string format date in a date object
     * @param date date value
     */
    FormDataDateFormating(date) {
        if (date !== 0 && date !== '' && date != null && date !== '0') {
            let d;
            if ( !(date instanceof Date) && date.split('').length !== 10) {
                if (date.indexOf('T') !== -1) {
                    d = date.split('T')[0].split('-');
                } else if (date.indexOf(' ') !== -1) {
                    d = date.split(' ')[0].split('-');
                } else {
                    d = date.split('-');
                }
                d = new Date(d[0], Number(d[1]) - 1, d[2]);
                return formatDate(d, 'dd-MM-yyyy 00:00:00', this.locale);
            } else {
                return formatDate(new Date(date), 'dd-MM-yyyy 00:00:00', this.locale);
            }
        }
        return '';
    }

    setFormDataArray(arr, keyName , index, element) {
        Object.keys(element).forEach(ele => {
            if (this.deleteKeys.includes(ele)) {
                delete element[ele];
            } else {
                if (element[ele]) {
                    if (this.skipkeys.includes(ele)) {
                        arr.push({ key: keyName + '[' + index + '].' + ele,
                        value: this.FormDataDateFormating(element[ele])});
                    } else {
                        arr.push({ key: keyName + '[' + index + '].' + ele, value: element[ele]});
                    }
                } else {
                    arr.push({ key: keyName + '[' + index + '].' + ele, value: NO_CHANGE});
                }
            }
        });
    }

    setFormData(arr, keyName, element) {
        Object.keys(element).forEach(ele => {
            if (!this.ignoreKeys.includes(ele)) {
                if (element[ele]) {
                    if (this.skipkeys.includes(ele)) {
                        arr.push({key: keyName + '.' + ele, value: this.FormDataDateFormating(element[ele])});
                    } else {
                        arr.push({ key: keyName + '.' + ele, value: element[ele]});
                    }
                } else {
                    arr.push({key: keyName + '.' + ele, value: NO_CHANGE});
                }
            }
        });
    }
}
