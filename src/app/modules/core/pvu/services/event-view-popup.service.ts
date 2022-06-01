import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EventViewPopupService {

    private empEventId: number = 0;
    private eventcode: string = '';
    private linkMenuid: number = 0;

    constructor() {
        this.empEventId = 0;
        this.eventcode = '';
        this.linkMenuid = 0;
    }

    set eventID(id) {
        this.empEventId = id;
    }

    get eventID() {
        return this.empEventId;
    }

    set eventCode(code) {
        this.eventcode = code;
    }

    get eventCode() {
        return this.eventcode;
    }

    set linkMenuID(id) {
        this.linkMenuid = id;
    }

    get linkMenuID() {
        return this.linkMenuid;
    }
}
