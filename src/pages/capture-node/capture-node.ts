import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CaptureNodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-capture-node',
  templateUrl: 'capture-node.html',
})
export class CaptureNodePage {
	private captureNodeForm: FormGroup;
	types=["Regular","Transformer","Ciruit Breaker","Dead End","Sub-Station","Power-Station"];
	poleMaterials=["Wooden","Concrete","Steel","FRC","N/A"];
	constructor(public loadingCtrl: LoadingController, public toastCtrl:ToastController, private formBuilder: FormBuilder,private storage: Storage, private alertCtrl:AlertController, private geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams) {
		var validators={
	      "nodetype":[Validators.required],
	      "numeric":[Validators.required,Validators.min(0),Validators.max(6),Validators.pattern("[0-9]{1}")]
	    };
	    this.captureNodeForm=this.formBuilder.group({
	      nodeType: ['',Validators.required],
	      poleMaterial: ['',Validators.required],
	      poles: ['',validators.numeric],
	      branches: ['',validators.numeric],
	      comment: [''],
	    });
	}


	captureNode(){
		if(this.captureNodeForm.valid){
			let loader = this.loadingCtrl.create({
		        content: "Capturing...",
		        spinner:"bubbles"
		      });
		    loader.present();
			this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp) => {
				let node:any=this.captureNodeForm.value;
				node.lat=resp.coords.latitude;
				node.lng=resp.coords.longitude;
				node.timestamp=resp.timestamp;
				this.storage.ready().then(()=> {
			        this.storage.get('nodes').then((nodes) =>{
			          nodes=this.addNode(nodes,node);
			          this.storage.set("nodes",nodes);
			          let alert = this.alertCtrl.create({
				          title: 'Capture Node',
				          subTitle: 'Node successfully captured!',
				          buttons: ['OK']
		          	  });
		          	  alert.present();
			        });
			        this.captureNodeForm.reset();
			        loader.dismiss();
				});
			}).catch((error) => {
			    let alert = this.alertCtrl.create({
		            title: 'Capture Node',
		            subTitle: 'Error: '+error,
		            buttons: ['OK']
	          	});
	          	alert.present();
	          	loader.dismiss();
			});
		}else{
			let toast = this.toastCtrl.create({
              message: 'Please capture correct Node data!',
              duration: 3000,
              position: 'bottom',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
		}
	}

	addNode(nodes:any,node:any){
		if(nodes!=null){		
			nodes.push(node);
		}else{
			nodes=[];
			nodes.push(node);
		}
		return nodes;
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad CaptureNodePage');
	}

}
