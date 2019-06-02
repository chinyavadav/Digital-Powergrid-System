import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from '../../providers/global/global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  phoneno:string;
  private signupForm: FormGroup;

  constructor(public toastCtrl:ToastController, private formBuilder: FormBuilder,public global: GlobalProvider, private loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController, public http: Http) {
    var validators={
      "phoneno":[Validators.required,Validators.pattern("[0-9]{10}")],
      "name":[Validators.required,Validators.pattern("[A-Za-z\s]{2,20}")],
      "password":[Validators.required,Validators.minLength(8),Validators.maxLength(20)]
    };
    this.signupForm=this.formBuilder.group({
      phoneno: ['',validators.phoneno],
      firstname: ['',validators.name],
      lastname: ['',validators.name],
      password: ['',validators.password],
    });
  }
  signUp() {
    if(this.signupForm.valid){
      this.http.post(this.global.serverAddress+"/api/signup.php", JSON.stringify(this.signupForm.value))
        .subscribe(data => {
          console.log(data["_body"]);
          let response = JSON.parse(data["_body"]);
          if(response.response=="success"){
             let alert = this.alertCtrl.create({
                title: 'Signup',
                subTitle: 'Account successfully created!',
                buttons: ['OK']
            });
             alert.present();
            this.navCtrl.pop();
          }else{
            let alert = this.alertCtrl.create({
                title: 'Signup',
                subTitle: 'Phone Number is already taken!',
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
            title: 'Signup',
            subTitle: 'Form data is invalid!',
            buttons: ['OK']
        });
        alert.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
