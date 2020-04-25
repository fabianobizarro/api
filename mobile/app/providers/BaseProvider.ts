import { Injectable } from '@angular/core';

@Injectable()
export class BaseProvider {

    constructor(){
        
    }
    protected formatError(callbackPromise) {
        return function (err) {
            try {
                let r = JSON.parse(err._body);
                callbackPromise(r);
            }
            catch (e) {
                callbackPromise(err);
            }

        };
    }

}