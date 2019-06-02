import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
	@ViewChild('map') mapElement: ElementRef;
	map: any;
	markers=[];
	nodes:any;

	first:any;
	last:any;

	toast:any;

	connections = [];
	polylines=[];

	constructor(public alertCtrl: AlertController, public toastCtrl:ToastController,public storage: Storage,public geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {

	}

	ionViewDidEnter() {
    	this.initMap();
	}

	setNodes(nodes:any){
		this.nodes=nodes;
	}

	setConnections(connections:any){
		this.connections=connections;
	}

	removeConnection(connection:any,inverse:any){
		let temp=[];
		for(var i=0;i<this.connections.length;i++){
			if(JSON.stringify(this.connections[i])!=JSON.stringify(connection) && JSON.stringify(this.connections[i])!=JSON.stringify(inverse)){
				temp.push(this.connections[i]);
			}
		}
		this.connections=temp;
		this.storage.set("connections",this.connections);
	}

	initConnection(first:any,last:any){
		let startNode = this.nodes.filter((node) => {
            return ((node.timestamp==first));
        });
		let endNode = this.nodes.filter((node) => {			
            return ((node.timestamp==last));
        });
        let startCoords={
        	lat: startNode[0].lat,
        	lng: startNode[0].lng
        };
		let endCoords={
			lat: endNode[0].lat,
			lng: endNode[0].lng
		};
		let connection=[startCoords, endCoords];
		return connection;
	}

	addConnection(connection:any){
		this.connections.push(connection);
		this.storage.set("connections",this.connections);
	}

	makeToast(message:string){
	    this.toast = this.toastCtrl.create({
	      message: message,
	      duration: 3000,
	      position: 'bottom',
	      cssClass: 'dark-trans',
	      closeButtonText: 'OK',
	      showCloseButton: true
	    });
	    this.toast.present();
	}

	addMarkers(){
		this.storage.ready().then(()=> {
			this.storage.get('connections').then((connections)=>{
				if(connections!=null){
					this.setConnections(connections);
				}
			});
			this.storage.get('nodes').then((nodes) =>{
				if(nodes!=null){
					this.setNodes(nodes);
					this.addPolylines();
					for (var i =0; i < nodes.length; i++) {
						var iconURL;
						switch(nodes[i].nodeType){
							case "Regular":
								iconURL='assets/powerlinepole.png';
								break;
							case "Transformer":
								iconURL="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=T|265bb2|000000";
								break;
							case "Ciruit Breaker":
								iconURL='assets/splice.png';
								break;
							case "Sub-Station":
								iconURL="assets/powersubstation.png";
								break;
							case "Power-Station":
								iconURL="assets/powerplant.png";
								break;
							default:
								iconURL='assets/powerlinepole.png';
								break;
						}
						let location = new google.maps.LatLng(nodes[i].lat,nodes[i].lng);
						var icon = {
						    url: iconURL,
						    scale: 1
						};
						let data:any={
							title: nodes[i].nodeType,
							contentString: '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">'+nodes[i].nodeType+'</h1><div id="bodyContent">Pole Material: '+nodes[i].poleMaterial+'\n '+nodes[i].poles+' Poles & '+nodes[i].branches+' Branches</div></div>'

						};
						setTimeout(this.addMarker(location,icon,data,nodes[i].timestamp), i * 200);
					}
				}
	        }, err=>{
	        	this.makeToast("Error: "+err.message);
	        });
		},err=>{
			this.makeToast("Error: "+err.message);
		});
	}

	clearPolylines(){		
		for(var i=0;i<this.polylines.length;i++){
			this.polylines[i].setMap(null);
		}		
	}

	deletePolylines(){
		this.clearPolylines();
		this.polylines=[];
	}

	addPolylines(){	
		for(var i=0;i<this.connections.length;i++){
			let line = new google.maps.Polyline({
	         	path: this.connections[i],
	         	strokeColor: '#000000',
	         	strokeOpacity: 1.0,
	         	strokeWeight: 1
	        });
	        this.polylines.push(line);
		}
		for(var j=0;j<this.polylines.length;j++){
			this.polylines[j].setMap(this.map);
		}
	}

	initMap() {
		//timeout: 5000
		this.geolocation.getCurrentPosition({ maximumAge: 3000, enableHighAccuracy: true }).then((resp) => {
			let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
			this.map = new google.maps.Map(this.mapElement.nativeElement, {
		  		zoom: 20,
		  		center: mylocation,
		  		mapTypeId: 'terrain'
			});
		}, err => {
			this.makeToast("Error: "+err.message);
		});

		this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data)=>{
			try{
				this.deleteMarkers();
				let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
				let image = '';
				let nodedata:any={
					title: 'My Location',
					contentString: '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">My Location</h1><div id="bodyContent">Latitude: '+data.coords.latitude+'\n Longitude: '+data.coords.longitude+'</div></div>'
				};
				this.addMarker(updatelocation,image,nodedata,null);
				this.addMarkers();
				this.setMapOnAll(this.map);	
			}catch{
			
			}
		});
	}

	addMarker(location, image, data:any, myTimestamp:any) {
		var infowindow = new google.maps.InfoWindow({
          content: data.contentString
        });
	  	let marker = new google.maps.Marker({
		    position: location,
		    map: this.map,
		    icon: image,
		    timestamp: myTimestamp
	    });

       	marker.addListener('dblclick', ()=>{
       		if(marker.timestamp!=null){
       			this.first=this.last;
       			this.last=marker.timestamp;
       			if(this.last!=this.first && this.first!=null && this.last!=null){
       				let connection=this.initConnection(this.first,this.last);
       				let inverse=[connection[1],connection[0]];
       				if(JSON.stringify(this.connections).indexOf(JSON.stringify(connection))!=-1 || JSON.stringify(this.connections).indexOf(JSON.stringify(inverse))!=-1){
       					let alert = this.alertCtrl.create({
				          title: 'Map',
				          subTitle: 'Do you want to disconnect nodes?',
				          buttons: [
			              	{ text:'YES', handler: ()=>{
			              			this.deletePolylines();
			              			this.removeConnection(connection,inverse);			              			
			              			this.addPolylines();
			              		}
			              	},
							{ text: 'NO' }
			              ]
		          	  	});
		          	  	alert.present();
       				}else{
       					let alert = this.alertCtrl.create({
				          title: 'Map',
				          subTitle: 'Do you want to join nodes?',
				          buttons: [
			              	{ text:'YES', handler: ()=>{
			              			this.addConnection(connection);
			              			this.addPolylines();
			              		}
			              	},
			              	{ text: 'NO' }
			              ]
		          	  	});
       					alert.present();
       				}
       				this.first=null;
			        this.last=null;
       			}
	       	}

       	});

        marker.addListener('click', function() {
			infowindow.open(this.map, marker);
			setTimeout(function(){infowindow.close();},'5000');      
        });
	  	this.markers.push(marker);
	}

	setMapOnAll(map) {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(map);
		}
	}

	clearMarkers() {
	 	this.setMapOnAll(null);
	}

	deleteMarkers() {
	 	this.clearMarkers();
	 	this.markers = [];
	}
}
