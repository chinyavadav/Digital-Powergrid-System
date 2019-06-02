import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from "../providers/global/global";

import { EnquiriesPage } from '../pages/enquiries/enquiries';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ReportPage } from '../pages/report/report';
import { SettingsPage } from '../pages/settings/settings';
import { SurveyPage } from '../pages/survey/survey';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl;  
  rootPage:any;
  constructor(public toastCtrl: ToastController, public global: GlobalProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController, public storage: Storage) {
    platform.ready().then(() => {          
      this.storage.ready().then(()=> {
        this.storage.get('serverAddress').then((val) =>{
          this.setServerAddress(val);
        });
        this.storage.get('session').then((val) =>{
          this.setAccount(val);
        });
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  setAccount(val){
    this.global.session=val;
    if(this.global.session==null){
      this.rootPage = LoginPage;
      this.global.dispSession.fullname="No Sesssion";
      this.global.dispSession.meterno="xxxxxxxxx"; 
      this.global.dispSession.lng="0"; 
      this.global.dispSession.lat="0"; 
    }else{
        if(this.global.session.hasOwnProperty("fldphoneno")){
          this.rootPage = SurveyPage;
        }else{
          this.rootPage = HomePage;
          this.global.dispSession.fullname=this.global.session.fldfullname;
          this.global.dispSession.meterno=this.global.session.fldmeterno;
          this.global.dispSession.lat=this.global.session.fldlatitude;
          this.global.dispSession.lng=this.global.session.fldlongitude;
        }
    }
  }

  setServerAddress(val){
    if(val==null){
      this.global.serverAddress="http://zetdc.000webhostapp.com/";
      this.storage.set("serverAddress",this.global.serverAddress);
    }else{
      this.global.serverAddress=val;
    }
  }

  openPage(index){
    var pages=[EnquiriesPage,ReportPage,SettingsPage];
    if(index==1){
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
    }else{
      this.navCtrl.push(pages[index]);
    }
  }
  
  logout(){
    this.storage.remove("session"); 
    this.global.session=null;
    this.global.dispSession.fullname="No Session";
    this.global.dispSession.meterno="xxxxxxxxx";
    this.global.dispSession.lat="0";
    this.global.dispSession.lng="0";
    this.navCtrl.setRoot(LoginPage);
  }

}

