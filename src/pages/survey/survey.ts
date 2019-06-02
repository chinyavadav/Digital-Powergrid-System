import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CaptureNodePage } from '../capture-node/capture-node';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { GlobalProvider } from "../../providers/global/global";

import { MapPage } from '../map/map';
import { LoginPage } from '../login/login';
import { NodesPage } from '../nodes/nodes';
import { SurveySettingsPage } from '../survey-settings/survey-settings';

@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html'
})
export class SurveyPage {
  session={
    phoneno:'',
    fullname:'',    
    district:''
  }
  constructor(public storage:Storage, public global: GlobalProvider, public http:Http,public navCtrl: NavController) {
    this.session.phoneno=this.global.session.fldphoneno;
    this.session.fullname=this.global.session.fldfullname;
    this.session.district=this.global.session.flddistrict;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveyPage');
  }

  captureNode(){
  	this.navCtrl.push(CaptureNodePage);
  }

  showNodes(){
    this.navCtrl.push(NodesPage);
  }

  logout(){
    this.storage.remove("session");
    this.global.session=null;
    this.navCtrl.setRoot(LoginPage);
  }

  settings(){
    this.navCtrl.push(SurveySettingsPage);
  }

  showMap(){
  	this.navCtrl.push(MapPage);
  }
}
