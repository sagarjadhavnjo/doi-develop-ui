import { Injectable } from '@angular/core';

@Injectable()

export class JpaUtilityService{

    constructor() {}

    private selectedJpaApprovedData: any;
    public isEdit = false;


    public setSelectedJpaApprovedData(data: any) {
        this.selectedJpaApprovedData = data;
    }

    public getSelectedJpaApprovedData() : any {
        return this.selectedJpaApprovedData;
    }
    
    public getNewPolicyNumber(): string {
        let financialYear: string = '';
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let curentYear: number = +currentDate.getFullYear().toString().substring(2);
        if ( currentMonth < 3) {
            financialYear = (curentYear -1) + '-' + curentYear;
        } else {
            financialYear = curentYear + '-' + (curentYear + 1);
        }
        return financialYear + '/DOI/JA/DM/XXX';
    }
}