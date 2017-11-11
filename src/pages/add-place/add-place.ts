import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from "../../modals/location";
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';
import { File, Entry, FileError } from '@ionic-native/file';

declare var cordova: any;

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {


  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };


  imageUrl = '';
  LocationIsSet = false;
  constructor(private modalCtrl: ModalController, private geolocation: Geolocation,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private camera: Camera, private placesService: PlacesService, private file: File) {
  }


  onSubmit(form: NgForm) {
    // console.log(form.value);
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageUrl = '';
    this.LocationIsSet = false;
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, { location: this.location, isSet: this.LocationIsSet });
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.LocationIsSet = true;
        }
      }
    );
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your Location....'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then
      (
      location => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.LocationIsSet = true;
      }
      )
      .catch(
      error => {
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Could get location,please pick it manually!',
          duration: 2500
        })
      }
      );
  }


  onTakePhoto() 
  {
          this.camera.getPicture
          ({
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true
           })
          .then
          (
                imageData => 
                {
                    const currentName = imageData.replace(/^.*[\\\/]/, '');
                    const path = imageData.replace(/[^\/]*$/, '');
                    const newFileName = new Date().getUTCMilliseconds() + '.jpg';
                    this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
                    .then(
                          (data:Entry) => 
                          {
                            this.imageUrl = data.nativeURL;
                            this.camera.cleanup();
                          })
                    .catch(
                            (err:FileError) => {
                            this.imageUrl = '';
                            const toast = this.toastCtrl.create({
                            message: 'Could not save the image.please try again',
                            duration: 2500
                          });
                    toast.present();
                    this.camera.cleanup();

                    });
                    this.imageUrl = imageData;
                    }
                    )  
      .catch
      (
            err => {
            const toast = this.toastCtrl.create({
            message: 'Could not save the image.please try again',
            duration: 2500
        })
      });
}

} 
