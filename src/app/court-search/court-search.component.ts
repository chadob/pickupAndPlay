import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
@Component({
  selector: 'court-search',
  templateUrl: './court-search.component.html',
  styleUrls: ['./court-search.component.css']
})
export class CourtSearchComponent implements OnInit {
  addCourtError;
  courtList: string[] = [];
  courtsObject = {};
  courtsArray = [];
  addressSearch;
  addressInput;
  addressArray = [];
  key = environment.firebase.apiKey;
  latitude = 47.620422;
  longitude = -122.349358;
  userLat;
  userLng;
  courtString = "court";
  constructor(private route:ActivatedRoute, private router:Router, private goToPageClass: GoToPage, private getService: GetService) { }

  ngOnInit() {
    this.fillCourtsObject();
    console.log(this.courtsArray);
  }
  fillCourtsObject() {
    this.getService.getAllData('courts').subscribe(courts => {
      for (var court in courts) {
        if (courts.hasOwnProperty(court)) {
          this.courtsObject[courts[court].name] = {name: courts[court].name, address: courts[court].location.address, coords: courts[court].location.coords};
        }
      }
      this.fillArray(this.courtsArray, this.courtsObject);
    });
  }
  getLatandLng(query) {

    var getCoordsRequest = this.getService.getLatAndLng("https://maps.googleapis.com/maps/api/geocode/json?address=", this.key, query).subscribe(results=> {
      console.log(results);
      this.addressArray = results.results;
      console.log(this.addressArray);
      getCoordsRequest.unsubscribe();
    });
  }
  search(query) {
    console.log(this.courtList);
    if (query.length > 3) {
      for (var court in this.courtsObject) {
        console.log((this.courtList.indexOf(court) < 0));
        if (this.courtsObject.hasOwnProperty(court) && court.toLowerCase().includes(query.toLowerCase()) && (this.courtList.indexOf(court) < 0)) {
          this.courtList.push(court);
          this.courtList.forEach(ele => {
            if(!(ele.toLowerCase().includes(query.toLowerCase()))) {
              this.courtList.splice(this.courtList.indexOf(ele), 1);
            }
          });
        }
      }
    }
    else {
      this.courtList = [];
    }
    console.log(this.courtList);
  }
  findAddress(address) {
    this.latitude = address.geometry.location.lat;
    this.longitude = address.geometry.location.lng;
    this.userLat = address.geometry.location.lat;
    this.userLng = address.geometry.location.lng;
    this.addressInput = address.formatted_address;
    this.addressArray = [];
  }
  fillArray(array, category) {
    for (var person in category) {
      if (category.hasOwnProperty(person)) {
        array.push(category[person]);
      }
    }
  }
  relocate(category, detail) {
    console.log('clicked');
    this.goToPageClass.goToPage(category,detail);
  }
}
