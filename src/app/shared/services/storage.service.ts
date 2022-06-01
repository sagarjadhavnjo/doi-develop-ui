import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _ls = new SecureLS({ encodingType: 'aes' });
    constructor() {
    }

    set(key: string, value: any, expired: number = 0) {
        this._ls.set(key, value);
    }

    remove(key: string) {
        this._ls.remove(key);
    }

    get(key: string) {
        return this._ls.get(key);
    }

    clear() {
        this._ls.removeAll();
    }
}
