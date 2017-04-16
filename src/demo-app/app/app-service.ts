import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class AppService {
  // URL to web API
  private questUrl = 'http://172.16.16.44:8012/api/questmodel';
  private requestOptions = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-auth-token': '1234qwerty'
    })
  });

  constructor (private http: Http) {}

  getQuests(): Observable<any> {
    return this.http.get(this.questUrl, this.requestOptions)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getQuestsByConsumer(consumer_id: Number): Observable<any> {
    return this.http.get(`${this.questUrl}?consumer=${consumer_id}`, this.requestOptions)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.map((elem) => elem || {})
               .map(function (elem) {
                 if ( !Array.isArray(elem.stages) ) {
                   elem.stages = [{}];
                 }
                 if (elem.stages.length == 0) {
                   elem.stages = [{}];
                 }
                 return elem
                });
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
