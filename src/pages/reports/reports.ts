import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
	reports:any;
	constructor(public toastCtrl:ToastController, public storage:Storage, public alertCtrl:AlertController, public http:Http,public global:GlobalProvider,public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReportsPage');
		this.getReports();
	}

	getReports() {
		this.http.get(this.global.serverAddress+"api/reports.php?meterno="+this.global.session.fldmeterno)
		.subscribe(data => {
			let response=JSON.parse(data["_body"]);
			this.reports=response;
		}, error => {
			let alert = this.alertCtrl.create({
              title: 'Reports',
              subTitle: 'Error connecting to Intenet!',
              buttons: ['OK']
            });
            alert.present();
		});
  	}

  	recall(item:any,report:any){
  		this.http.get(this.global.serverAddress+"api/recall.php?reportid="+report.fldreportid)
		.subscribe(data => {
			let response=JSON.parse(data["_body"]);		
			if(response.response=="success"){
				let alert = this.alertCtrl.create({
	              title: 'Reports',
	              subTitle: 'Report has been successfully recalled!',
	              buttons: ['OK']
	            });
            	alert.present();
            	this.getReports();
			}else{
				let alert = this.alertCtrl.create({
	              title: 'Reports',
	              subTitle: 'Report cannot be recalled!',
	              buttons: ['OK']
	            });
            	alert.present();
			}
		}, error => {
			let alert = this.alertCtrl.create({
              title: 'reports',
              subTitle: 'Error connecting to Intenet!',
              buttons: ['OK']
            });
            alert.present();
		});
		item.close();
  	}

  	filterReports(ev: any) {
	    this.http.get(this.global.serverAddress+"api/reports.php?meterno="+this.global.session.fldmeterno)
	      .subscribe(data => {
	        let response=JSON.parse(data["_body"]);
	        let val = ev.target.value;
	        if (val && val.trim() !== '') {
	          	this.reports = response.filter((report) => {
	            	return ((report.fldtype.toLowerCase().indexOf(val.toLowerCase()) > -1));
	          	});
	        }else{
	        	this.reports=response;
	        }
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
	      }
	    );
	}
}
