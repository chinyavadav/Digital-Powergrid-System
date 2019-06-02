import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController} from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import { SurveyLoginPage } from '../survey-login/survey-login';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from "../../providers/global/global";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm: FormGroup;
  isDisabled:boolean=false;
  constructor(public loadingCtrl:LoadingController, private formBuilder: FormBuilder,public global:GlobalProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public toastCtrl: ToastController, private storage: Storage) {
    this.loginForm=this.formBuilder.group({
      meterno: ['',Validators.required],
      password: ['',Validators.required]
    });
  }
  loginFxn() {
    if(this.loginForm.valid){
      let loader = this.loadingCtrl.create({
        content: "Authenticating...",
        spinner:"bubbles"
      });
      loader.present();
      this.http.post(this.global.serverAddress+"api/login.php", JSON.stringify(this.loginForm.value))
        .subscribe(data => {
          console.log(data["_body"]);
          let response=JSON.parse(data["_body"]);
          if(response.response=="success"){
            let toast = this.toastCtrl.create({
              message: 'Login was successfully',
              duration: 3000,
              position: 'bottom',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
            this.navCtrl.setRoot(HomePage);
            this.storage.set("session",response);
            this.global.dispSession.fullname=response.fldfullname;
            this.global.dispSession.meterno=response.fldmeterno;
            this.global.dispSession.lat=response.fldlatitude;
            this.global.dispSession.lng=response.fldlongitude;
            this.global.session=response;
          }else{
            let alert = this.alertCtrl.create({
              title: 'Login',
              subTitle: 'Credentials are incorrect!',
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
      loader.dismiss();
    }else{
        let alert = this.alertCtrl.create({
            title: 'Login',
            subTitle: 'Meter Number or Password cannot be null!',
            buttons: ['RETRY']
        });
        alert.present();
    }
  }

  survey(){
    this.navCtrl.push(SurveyLoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
