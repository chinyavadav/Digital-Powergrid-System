import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
	  newaddress:string;
    private settingsForm: FormGroup;
    private passwordForm: FormGroup;
	constructor(private formBuilder: FormBuilder,public global: GlobalProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public toastCtrl: ToastController, public storage: Storage) {
        var validators={
          "password":[Validators.required,Validators.maxLength(20),Validators.minLength(8)]
        };
        this.passwordForm=this.formBuilder.group({
            password: ['',validators.password],
            verifypassword: ['',validators.password],
            meterno: ['',Validators.required]
        });
        this.newaddress=this.global.serverAddress;
        var address_validators=[Validators.required,Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')];
        this.settingsForm=this.formBuilder.group({
            address: ['',address_validators]
        });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
	}

	updateSettings(){
        if(this.settingsForm.valid){
    		let toast = this.toastCtrl.create({
                message: 'Settings have been updated!',
                duration: 3000,
                position: 'bottom',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
            });
            toast.present();
            this.storage.set("serverAddress",this.newaddress);
            this.global.serverAddress=this.newaddress;
        }
	}

  update(){
    if(this.passwordForm.valid){
      this.http.post(this.global.serverAddress+"/api/password.php", JSON.stringify(this.passwordForm.value))
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
