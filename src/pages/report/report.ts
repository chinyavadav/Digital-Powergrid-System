import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
	private reportFaultForm: FormGroup;
	types=["Blackout","Transformer Failure","Broken Power Cable","Broken Utiliy Pole","Other"];
	
	constructor(public global:GlobalProvider, public http:Http, public loadingCtrl: LoadingController, public toastCtrl:ToastController, private formBuilder: FormBuilder,private storage: Storage, private alertCtrl:AlertController, private geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams) {
	    this.reportFaultForm=this.formBuilder.group({
	      type: ['',Validators.required],
	      lng:['',Validators.required],
	      lat:['',Validators.required],
	      comment: ['',Validators.maxLength(100)],
	      meterno: ['',Validators.required]
	    });
	}


	post(){
		this.http.post(this.global.serverAddress+"/api/report.php", JSON.stringify(this.reportFaultForm.value))
	      .subscribe(data => {
	        console.log(data["_body"]);
	        let response = JSON.parse(data["_body"]);
	        if(response.response=="success"){
	           let alert = this.alertCtrl.create({
	              title: 'Report',
	              subTitle: 'Report was successfully submitted!',
	              buttons: ['OK']
	          });
	          alert.present();
	          this.reportFaultForm.reset();
	        }else{
	          let alert = this.alertCtrl.create({
	              title: 'Report',
	              subTitle: 'Report could not be submitted!',
	              buttons: ['OK']
	          });
	          alert.present();
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

	reportFault(){
	    if(this.reportFaultForm.valid){
		    let alert = this.alertCtrl.create({
			  title: 'Report',
			  subTitle: 'Is fault close to your home location?',
			  buttons: [
			  	{
			  		text:'NO',
			  		handler: ()=>{
						this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp) => {
							this.reportFaultForm.value.lat=resp.coords.latitude;
							this.reportFaultForm.value.lng=resp.coords.longitude;
							this.post();
						}).catch((error) => {
						    let alert = this.alertCtrl.create({
					            title: 'Report',
					            subTitle: 'Error: '+error,
					            buttons: ['OK']
				          	});
				          	alert.present();
						});
			  		}
			  	},
				{
					text: 'YES',
					handler: ()=>{
						this.post();
					}
				}
			  ]
		  	});
	  	alert.present();
	    }else{
	      let alert = this.alertCtrl.create({
	          title: 'Report',
	          subTitle: 'Please enter correct form data!',
	          buttons: ['OK']
	      });
	      alert.present();
	    }
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReportFaultPage');
	}

}
