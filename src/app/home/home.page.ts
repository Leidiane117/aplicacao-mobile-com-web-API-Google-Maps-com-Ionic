import { Component, ElementRef, OnInit, ViewChild,NgZone } from '@angular/core';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';


declare var google: any; // varíavel global, da api do google
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(
    'map', { static: false})mapElement: ElementRef; // decorator para mandar mostrar o mapa na nossa div
  map: any; // que irá receber nosso map
  autocompleteItems: any[]; //array que recebera os itens 
  autocomplete: { input: string; }; // atributo que irá receber o meu input, vai iniciar vazio
  googleAutocomplete: any; //atributo que irá receber o autocomplete objeto
  description:any;

  constructor(
   private nativeGeocoder: NativeGeocoder, private zone: NgZone
   
    )
  { this.autocomplete={ input: ""};
    this.autocompleteItems= [];
    this.googleAutocomplete =  new google.maps.places.AutocompleteService();
    
  }
  ngOnInit() {
     
    //throw new Error('Method not implemented.');
  }

  lerMapa(item: any){ // parametro item do meu método ler mapa
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5 // limitar resultados da busca
  };
 
  
  this.nativeGeocoder.forwardGeocode(item.description, options)
    .then((result: NativeGeocoderResult[]) => 
    {    
    
    
    let latitude= result[0].latitude; // variáveis locais
    let longitude= result[0].longitude;
      
      const latLng = new google.maps.LatLng(latitude,longitude);

      const mapOptions = // configurações do mapa 
      {
        center : latLng,
        zoom : 15,
        mapTypeId : google.maps.MapTypeId.ROADMAP 
      }
 
    this.map = new google.maps.Map (this.mapElement.nativeElement, mapOptions);
    this.autocomplete={input: item.description};
    this.autocompleteItems=[];

     new google.maps.Marker ( { // adicionando um marcador da localização pesquisada
      position: new google.maps.LatLng(latitude, longitude),
      title: 'Pin Point',
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: 'assets/img/point.png' // imagem do meu marcador
     });
    })
    .catch((error: any)=> alert(error));

  }



  updateProcurar(){ // pesquisar os items e jogar no meu array
    if(this.autocomplete.input== ""){

      this.autocompleteItems = [];
      return; // sai do método para n ficar fazendo requisições vazias

    }
    this.googleAutocomplete.getPlacePredictions({ input: this.autocomplete.input},
      
      (predictions: any, status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => { // foreach vai percorrer os possíveis endereços achados da api
            this.autocompleteItems.push(prediction);// na hora de compilar estava dando a propriedade forEach null            
          }); 
        });


      });

  }


}



   
    
 
