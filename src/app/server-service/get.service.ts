import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class GetService {
  private dataUrl = "https://pick-up-and-play.firebaseio.com";
  constructor(private http: HttpClient, private database: AngularFireDatabase){}

  getAllData (route): Observable<any> {
    var data = this.database.object(route).valueChanges();
    return data;
  }
  pushData (route, data): Observable<any> {
    var connection = this.database.list(route);
    connection.push(data);
    var observable = connection.snapshotChanges();
    return observable;
  }
  postData (route, data): Observable<any> {
    var connection = this.database.object(route);
    connection.update(data);
    var observable = connection.snapshotChanges();
    return observable;
  }
  removeData (route): Observable<any> {
    var connection = this.database.object(route);
    connection.remove();
    var observable = connection.snapshotChanges();
    return observable;
  }
  //functions for gmaps integration:
  getLatAndLng(url, key, query): Observable<any> {
    return this.http.get<any>(url + query + "&key=" + key);
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption

    // Let the app keep running by returning an empty result.
    return of(result as T);
    };
  }
}
