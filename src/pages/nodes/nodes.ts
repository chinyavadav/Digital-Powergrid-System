import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the NodesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nodes',
  templateUrl: 'nodes.html',
})
export class NodesPage {
	nodes:any;
	constructor(public toastCtrl:ToastController, public storage:Storage, public alertCtrl:AlertController, public http:Http,public global:GlobalProvider,public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NodesPage');
		this.getNodes();
	}

	getNodes() {
		this.storage.get('nodes').then((nodes) =>{
			if(nodes!=null){
				this.nodes=nodes;
			}
		});
  	}

  	deleteNode(item:any,node:any){
  		let temp=[];
		for(var i=0;i<this.nodes.length;i++){
			if(JSON.stringify(this.nodes[i])!=JSON.stringify(node)){
				temp.push(this.nodes[i]);
			}
		}
		this.nodes=temp;
		this.storage.set("nodes",this.nodes);
		
		let tempConns=[];
		this.storage.get('connections').then((connections) =>{
			if(connections!=null){
				console.log(connections);
				console.log(node);
				for(var j=0;j<connections.length;j++){
					if(connections[j][0].lng!=node.lng && connections[j][0].lat!=node.lat && connections[j][1].lng!=node.lng && connections[j][1].lat!=node.lat){
						tempConns.push(connections[j]);
					}
				}
				this.storage.set("connections",tempConns);
			}
		});
		item.close();
  	}

  	deleteAll(){
		let alert = this.alertCtrl.create({
		  title: 'Map',
		  subTitle: 'Do you want to delete all data?',
		  buttons: [
		  	{ text:'YES', handler: ()=>{
			  		this.nodes=null;
			  		this.storage.set("nodes",null);
			  		this.storage.set("connections",null);
			  		let toast = this.toastCtrl.create({
				      message: "Data deleted successfully!",
				      duration: 3000,
				      position: 'bottom',
				      cssClass: 'dark-trans',
				      closeButtonText: 'OK',
				      showCloseButton: true
				    });
				    toast.present();
		  		}
		  	},
			{ text: 'NO' }
		  ]
	  	});
	  	alert.present();
  	}

  	uploadNodesConnections(){
  		this.storage.get('nodes').then((nodes) =>{
			if(nodes!=null){
				this.storage.get('connections').then((connections) =>{
					if(connections==null){
						connections=[];
					}
					let data={"nodes":nodes,"connections":connections};
				    this.http.post(this.global.serverAddress+"api/nodes.php", JSON.stringify(data))
						.subscribe(data => {
			  				console.log(data["_body"]);
			  				let response=JSON.parse(data["_body"]);
				  			if(response.response=="success"){
				  				this.nodes=null;
				  				this.storage.set("nodes",null);
				  				this.storage.set("connections",null);
				    			let toast = this.toastCtrl.create({
				      				message: 'Data uploaded successfully!',
				      				duration: 3000,
				      				position: 'bottom',
				      				cssClass: 'dark-trans',
				      				closeButtonText: 'OK',
				      				showCloseButton: true
				    			});
		    					toast.present();
		 					}else{
		    					let alert = this.alertCtrl.create({
		      						title: 'Nodes',
		      						subTitle: 'Data could not uploaded!',
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
						});
				});
			}else{
		    	let alert = this.alertCtrl.create({
						title: 'Nodes',
						subTitle: 'No data to upload!',
						buttons: ['OK']
				});
				alert.present();
			}
		});
  	}

}
