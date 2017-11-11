import { Place } from '../modals/place';
import { Location } from '../modals/Location';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

declare var cordova: any;

@Injectable()
export class PlacesService
{
    private places: Place[]= [];

    constructor(private storage:Storage,private file:File)
    {

    }
    addPlace(
            title:string,
            description:string,
            location: Location,
            imageUrl: string)
            {
                const place = new Place(title , description, location, imageUrl);
                this.places.push(place);
                this.storage.set('places',this.places)
                .then(
                )
                .catch(
                err =>
                    {
                         this.places.splice(this.places.indexOf(place),1);
                     }

                );
                
            }

loadPlaces()
{
    return this.places.slice();
}


fetchPlaces()
{
    return this.storage.get('places')
    .then(
        (places:Place[]) => {
            this.places = places != null ? places : [];
            return this.places;
        }
    )
    .catch(
        err =>
        {
            console.log(err);
        }
    )
}
deletePlace(index:number)
{
    this.places.splice(index,1);   
}

private removeFile(place: Place)
{
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
    this.file.removeFile(cordova.file.dataDirecotory,currentName)
    .then(
        () => console.log('Removed file')
    )
    .catch(
        () => {
            console.log('Error while removing File');
            this.addPlace(place.title,place.description,place.location,place.imageUrl);
        }
        );
}

}