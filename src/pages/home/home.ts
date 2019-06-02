import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { ReportPage } from '../report/report';
import { ReportsPage } from '../reports/reports';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ChatServiceProvider, ChatMessage } from "../../providers/chat-service/chat-service";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  loader:any;
  constructor(public chatService:ChatServiceProvider, public storage:Storage, public loadingCtrl:LoadingController, public http:Http, public geolocation:Geolocation, public toastCtrl: ToastController, public alertCtrl:AlertController, public global:GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  submit(mydata:any){
    this.http.post(this.global.serverAddress+"/api/location.php", JSON.stringify(mydata))
      .subscribe(data => {
        console.log(data["_body"]);
        let response = JSON.parse(data["_body"]);
        if(response.response=="success"){
           let alert = this.alertCtrl.create({
              title: 'Home',
              subTitle: 'Location has been successfully updated!',
              buttons: ['OK']
          });
          alert.present();
          this.global.session.fldlongitude=mydata.lng;
          this.global.session.fldlatitude=mydata.lat;
          this.global.dispSession.lng=mydata.lng;
           this.global.dispSession.lat=mydata.lat;
          this.storage.set("session",this.global.session);
        }else{
          let alert = this.alertCtrl.create({
              title: 'Home',
              subTitle: "Location could not be updated!",
              buttons: ['OK']
          });
          alert.present();
       }
       this.loader.dismiss();
      }, error => {
          let toast = this.toastCtrl.create({
            message: 'Please connect to Internet!',
            duration: 3000,
            position: 'bottom',
            cssClass: 'dark-trans',
            closeButtonText: 'OK',
            showCloseButton: true
          });
          toast.present();
          this.loader.dismiss();
      }      
    );
  }

  updateLocation(){
    let alert = this.alertCtrl.create({
      title: 'Map',
      subTitle: 'Do you want update location?',
      buttons: [
        { text:'YES', handler: ()=>{
            this.loader = this.loadingCtrl.create({
              content: "Updating...",
              spinner:"bubbles"
            });
            this.loader.present();
            this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
              let data = {
                lat:resp.coords.latitude,
                lng:resp.coords.longitude,
                meterno:this.global.session.fldmeterno
              };
              this.submit(data);
            }, err => {
              let toast = this.toastCtrl.create({
                message: "Error: "+err.message,
                duration: 3000,
                position: 'bottom',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
              this.loader.dismiss();
            });
          }
        },
      { text: 'NO' }
      ]
      });
      alert.present();
  }

  reportFault(){
    if(this.global.session.fldlatitude=='0' && this.global.session.fldlongitude=='0'){
      let toast = this.toastCtrl.create({
        message: 'Please record home location!',
        duration: 3000,
        position: 'bottom',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();     
    }else{
      this.navCtrl.push(ReportPage);
    }
  }

  myReports(){
    this.navCtrl.push(ReportsPage);
  }

}
