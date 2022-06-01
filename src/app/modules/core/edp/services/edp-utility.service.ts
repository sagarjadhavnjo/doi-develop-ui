import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { FilterNamesWithType, Types } from '../model/common.model';

@Injectable({
    providedIn: 'root'
})
export class EdpUtilityService {
    constructor() {}

    getSearchFilterRequest(formGroup: FormGroup, filterNamesWithTypes: FilterNamesWithType[]) {
        const controls = formGroup.controls;
        const searchFilterRequest = [];
        filterNamesWithTypes.forEach(filter => {
            const val = controls[filter.name].value;
            switch (filter.type) {
                case Types.Number:
                    filter.value = val ? +val : 0;
                    break;
                case Types.String:
                    filter.value = val ? val.trim() : '';
                    break;
                case Types.Date:
                default:
                    const datePipe = new DatePipe('en-US');
                    filter.value = datePipe.transform(val, 'MM/dd/yyyy') || '';
                    break;
            }

            searchFilterRequest.push({ key: filter.name, value: filter.value });
        });
        return searchFilterRequest;
    }

    updatePaginationEventOnPageChange(event: PageEvent, paginationInfo: any, storedData: []) {
        if (
            event != null &&
            event.pageIndex < event.previousPageIndex &&
            paginationInfo.iteratablePageIndex - 1 === Math.ceil(paginationInfo.pageElements / paginationInfo.pageSize)
        ) {
            paginationInfo.iteratablePageIndex = Math.ceil(paginationInfo.pageElements / paginationInfo.pageSize) - 1;
            /*
            below if Condition is to handle button of 'Go First Page'
            Reset iteratablePageIndex to 0
            */
            if (
                event !== null &&
                event.previousPageIndex > event.pageIndex &&
                event.previousPageIndex - event.pageIndex > 1
            ) {
                paginationInfo.iteratablePageIndex = 0;
            }
        } else if (
            event != null &&
            event.pageIndex > event.previousPageIndex &&
            event.pageIndex - event.previousPageIndex > 1
        ) {
            /**
             * else if conditin to handle button of 'Go Last Page'
             * reset iteratablePageIndex to last pageIndex of particular pageSet
             */
            paginationInfo.iteratablePageIndex = Math.ceil(storedData.length / paginationInfo.pageSize) - 1;
        } else {
            paginationInfo.iteratablePageIndex = 0;
        }
    }

    updatePaginationOnButtonsClicked(event: PageEvent, paginationInfo: any) {
        paginationInfo.pageSize = event.pageSize;
        paginationInfo.pageIndex = event.pageIndex;
        if (event.pageIndex < event.previousPageIndex) {
            paginationInfo.iteratablePageIndex = paginationInfo.iteratablePageIndex - 1;
            if (paginationInfo.iteratablePageIndex < 0 || event.previousPageIndex - event.pageIndex > 1) {
                paginationInfo.iteratablePageIndex =
                    Math.ceil(paginationInfo.pageElements / paginationInfo.pageSize) + 1;
                paginationInfo.pageIndex = 1;
            }
        } else if (event.pageIndex === event.previousPageIndex) {
            paginationInfo.iteratablePageIndex = 0;
        } else if (event.pageIndex > event.previousPageIndex && event.pageIndex - event.previousPageIndex > 1) {
            paginationInfo.iteratablePageIndex = event.pageIndex;
        } else {
            paginationInfo.iteratablePageIndex = paginationInfo.iteratablePageIndex + 1;
        }
    }
}
