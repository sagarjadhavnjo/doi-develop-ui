import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data = {};
    private dataUpdated = new Subject();

    constructor() {}

    setOption(option, value) {
        this.data[option] = value;
    }

    getOption() {
        return this.data;
    }
    setObv(option, value) {
        this.data[option] = value;
        this.dataUpdated.next(this.data);
    }
    getObv() {
        return this.dataUpdated.asObservable();
    }
}
