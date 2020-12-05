import { Component, ElementRef, ViewChild } from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';


declare var google: any; // varíavel global, da api do google
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(
    'map', { static: false})mapElement: ElementRef; // decorator para mandar mostrar o mapa na nossa div
  map: any; // que irá receber nosso map
  latitude: number;
  longitude: number;
  endereco: any;
  constructor(
    private  geolocation: Geolocation, private nativeGeocoder: NativeGeocoder
    )
  {}

  lerMapa(){
    this.geolocation.getCurrentPosition().then((resp) => {
      //let latitude = 23.5227;
      //let longitude = -46.8368; // variáveis locais;
     this.latitude = resp.coords.latitude; // coordenadas da minha localozação 
     this.longitude = resp.coords.longitude;

     const latinlng = new google.maps.LatLng(this.latitude, this.longitude);

     const mapOptions = // configurações do mapa 
     {
       center : latinlng,
       zoom : 15,
      // mapTypeId : google.maps.mapTypeId.ROADMAP // na hora de compilar estava dando undefined, por isso retirei o ROADMap
     }

   this.map = new google.maps.Map (this.mapElement.nativeElement, mapOptions);
    this.map.addListener('dragend', () => { // atributo map que irá receber o método da api google maps
      this.latitude = this.map.center.lat(); // listener que atualiza de acordo com a posição do mapa
      this.longitude = this .map.center.lng();
     });
    new google.maps.Marker ( { // adicionando um marcador da localização pesquisada
     position: new google.maps.LatLng(this.latitude, this.longitude),
     title: 'Pin Point',
     map: this.map,
     icon: 'assets/img/point.png' // imagem do meu marcador
    });
    
  this.obterEndereco(this.latitude, this.longitude);
   }); // chamando meu métpdo que vai obter o endereço 
    
  }
  obterEndereco(latitude: number, longitude: number) {
    console.log("Coordenadas: " + latitude + " " + longitude);
    const options: NativeGeocoderOptions = {
       useLocale: true,
       maxResults: 5
      };

     this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.endereco = '';
        const responseAddress = [];
        for (const [key, value] of Object.entries(result[0])) {
          if (value.length > 0) { // se valor maior que 0/ valor da pesquisa
            responseAddress.push(value); // alimentar o array 
          }
        }
        responseAddress.reverse();
        this.endereco = responseAddress[2] + ', ' +
          responseAddress[1] + ' ' +
          responseAddress[3] + ' ' +
          responseAddress[4] + ' ' +
          responseAddress[5] + ' ' +
          responseAddress[6] + ' ' +
          responseAddress[7] + ' ' +
          responseAddress[8];
      })
      .catch((error: any) => {
        this.endereco = 'Endereço não disponível!'; // caso de erro
      });
 
    }

  }

