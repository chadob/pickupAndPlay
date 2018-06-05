import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Component({
  selector: 'create-court',
  templateUrl: './create-court.component.html',
  styleUrls: ['./create-court.component.css']
})
export class CreateCourtComponent implements OnInit {
  court = {
    name: '',
    cost: '',
    location: {
      address: '',
      coords: '',
      inside: '',
    },

    activity: '',
    description: '',
    creator: {}
  };
  addCourtError;
  addressSearch;
  addressArray = [];
  courtsObject = {};
  currentUser;
  addressInputted = false;
  key = environment.firebase.apiKey;
  latitude;
  longitude;
  constructor(private route:ActivatedRoute, private router:Router, private getService: GetService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fillCourtsObject();
  }
  fillCourtsObject() {
    this.getService.getAllData('courts').subscribe(courts => {
      for (var court in courts) {
        if (courts.hasOwnProperty(court)) {
          this.courtsObject[courts[court].name] = {name: courts[court].name, address: courts[court].location.address};
        }
      }
      console.log(this.courtsObject);
    });
  }
  getLatandLng(query) {
    this.getService.getLatAndLng("https://maps.googleapis.com/maps/api/geocode/json?address=", this.key, query).subscribe(results=> {
      console.log(results);
      this.addressArray = results.results;
      console.log(this.addressArray);
    });
  }
  removeMessage() {
    this.addressInputted = false;
  }
  saveAddress(address) {
    console.log(address)
    this.court.location.address = address.formatted_address;
    this.court.location.coords = address.geometry.location;
    this.latitude = address.geometry.location.lat;
    this.longitude = address.geometry.location.lng;
    this.addressArray = [];
    this.addressInputted = true;
  }
  searchCourts(query) {
    console.log(this.courtsObject);
    for (var court in this.courtsObject) {
      if (query === court) {
        this.addCourtError = "A court already exists at that location."
      }
    }
  }
  onSubmit () {
    this.court.creator = {
      name: this.currentUser.username,
      uid: this.currentUser.uid
    }
    console.log(this.court);
    this.getService.postData('courts/' + this.court.name, this.court).subscribe(value => {
      console.log(value);
      this.router.navigate(['court', this.court.name]);
    });
  }
}
