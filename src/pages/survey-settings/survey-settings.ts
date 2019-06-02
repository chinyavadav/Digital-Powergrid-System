import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the PassengerProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-survey-settings',
  templateUrl: 'survey-settings.html',
})
export class SurveySettingsPage {
	private passwordForm:FormGroup;
	constructor(public toastCtrl:ToastController, private global:GlobalProvider,private http:Http,private alertCtrl:AlertController,private formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams) {
		var validators={
	      "password":[Validators.required,Validators.maxLength(20),Validators.minLength(8)]
	    };

		this.passwordForm=this.formBuilder.group({
			password: ['',validators.password],
			verifypassword: ['',validators.password],
			phoneno: ['',Validators.required]
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SurveySettingsPage');
	}

	update(){
  		if(this.passwordForm.valid){
	  		this.http.post(this.global.serverAddress+"/api/survey-password.php", JSON.stringify(this.passwordForm.value))
	        .subscribe(data => {
	          console.log(data["_body"]);
	          let response = JSON.parse(data["_body"]);
	          if(response.response=="success"){
	             let alert = this.alertCtrl.create({
	                title: 'Password',
	                subTitle: 'Password successfully changed!',
	                buttons: ['OK']
	            });
	            alert.present();
	            this.passwordForm.reset();
	          }else{
	            let alert = this.alertCtrl.create({
	                title: 'Password',
	                subTitle: response.response,
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
	  	}else{
	        let alert = this.alertCtrl.create({
	            title: 'Password',
	            subTitle: 'Please use valid password!',
	            buttons: ['RETRY']
	        });
	        alert.present();
	    }
  }

}
