import { Injectable } from '@angular/core';
import { Events, ToastController } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { Http } from "@angular/http";
import { Observable } from "rxjs/observable";
import { GlobalProvider } from '../global/global';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class ChatMessage {
  messageId: string;
  box: string;
  message:string;
  status:string;
  timestamp: number | string;
}


@Injectable()
export class ChatServiceProvider {

  msgList: ChatMessage[] = [];
  constructor(public toastCtrl:ToastController, public global: GlobalProvider, private http: Http,private events: Events) {
  }

  getMsg() {
    return this.getMsgList().subscribe(res => {
      this.msgList=res;     
    });
  }

  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = this.global.serverAddress+'api/messages.php?meterno='+this.global.session.fldmeterno;
    return this.http.get(msgListUrl).pipe(map(response =>JSON.parse(response["_body"]).array));
  }

  sendMsg(msg: ChatMessage) {
    console.log(msg);
    this.http.get(this.global.serverAddress+'api/message.php?meterno='+this.global.session.fldmeterno+"&message="+msg.message)
      .subscribe(data => {
        let response=JSON.parse(data["_body"]);
        if(response.response=="success"){
          this.getMsg();
        }
      }, error => {
        console.log("Error: "+error.message);
      }
    );
  }

}
