
export class SuspendedList {
  lookupInfoId: number;
  lookupInfoName: string;
}

export class EmployeeEventsList {
  empNumber: number | '';
  empName: string | '';
  caseNo: string | '';
  empPayBand: string | '';
  empPayBandValue?: number;
  empPayLevel: string | '';
  empBasicPay: number;
  dateOfNextIncrement: string | '';
  empDesignation: string | '';
  optionOpted: string | '';
  dateOfAudit: string;
}

export class EmployeementHistory {
  employementType: string | '';
  employementTypeName: string | '';
  deptName: string | '';
  officeName: string | '';
  officeAdd: string | '';
  empDesignationHist: string | '';
  fromDate: string | '';
  toDate: string | '';
  lastPayDrawn: number;
  empServiceContinuation: string | '';
  empServiceContinuationName: string | '';
  orderNoDate: string | '';
  empId: number;
  employeHistroyId: number;
}

export class QualificationData {
  empQualiId: number;
  degree: number;
  courseName: string | '';
  isOtherCourseName: boolean;
  otherCourseName: string | '';
  passingYear: string | '';
  schoolCollege: string | '';
  universityBoard: string | '';
  percentageCGPA: string;
  remarks: string | '';
}
export class MasterPhdData {
  empQualiId: number;
  degree: number;
  courseName: string | '';
  isOtherCourseName: boolean;
  otherCourseName: string | '';
  passingYear: string | '';
  schoolCollege: string | '';
  universityBoard: string | '';
  percentageCGPA: string;
  remarks: string | '';
}
export class NomineeData {
  empNomineeId: string | '';
  relationship: string | '';
  otherRelationship: String | '';
  isOtherRelation: boolean;
  nomineeName: string | '';
  nomineeAddress: string | '';
  nomineeAge: string | '';
  nomineeShare: number | '';
  photoOfNominee: string | '';
  genNomiForm: string | '';
  npsNomiForm: string | '';
  nomineePhotoName: string | '';
  genNomineeFormName: string | '';
  npsNomineeFormName: string | '';
  fileBrowseNpsForm: boolean;
  fileBrowseGenForm: boolean;
  fileBrowseNomi: boolean;
}
export class DeptExamData {
  empDeptExamDetailId: number;
  deptExamName: string | '';
  examBody: number;
  deptHodName: number;
  otherDeptHodName: string;
  dateOfPassing: string | '' | Date;
  examStatus: number;
  examAttempts: string;
  remarks: string | '';
  disabledeptHOD: boolean;
}
export class CCCExamData {
  empCCCExamDetailId: number;
  cccExamName: number;
  cccExamNameDisable: boolean;
  examBody: number;
  dateOfExam: string | '' | Date;
  dateOfPassing: string | '' | Date;
  examStatus: number;
  certificateNo: string | '';
  remarks: string | '';
  cccExamNameList?: any;
}
export class LanguageExamData {
  empLangExamId: number;
  langName: number;
  langNameDisable: boolean;
  examBody: string | '';
  examType: number;
  examTypeDisable: boolean;
  dateOfPassing: string | '' | Date;
  seatNo: string;
  examStatus: number;
  remarks: string | '';
  langNameList?: any;
  langTypeList?: any;
}

