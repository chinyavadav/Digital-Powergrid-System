import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
	session:any;
	serverAddress:string;
	dispSession={
    	fullname:"No Session",
    	meterno:"xxxxxxxxx",
    	lat:"0",
    	lng:"0"
  	};
}
