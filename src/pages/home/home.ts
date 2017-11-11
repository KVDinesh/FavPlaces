import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../modals/place';
import { PlacesService } from '../../services/places';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  addPlacePage = AddPlacePage;
  places: Place[]=[];
  constructor(private modalCtrl: ModalController,private placesService:PlacesService) {

  }
  ionViewWillEnter()
  {
     this.places = this.placesService.loadPlaces();
  }
    
  onOpenPlace(place:Place,index : number)
  {
      const modal=this.modalCtrl.create(PlacePage, { place: place,index: index });
      modal.present();
  }
  ngOnInit()
  {
    this.placesService.fetchPlaces()
    .then(
      (places: Place[]) => this.places =places
    );
    
  }
}
