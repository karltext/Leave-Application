import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Request } from 'request'
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LeaveRequest } from './leave-request';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private http: HttpClient) { }

  rootURL = "http://localhost:3990"

  httpOpts = {
    headers: new HttpHeaders(
      {"Content-Type": "application/json;charset=UTF-8"})
  }

  // https://angular.io/guide/http
  // https://angular.io/tutorial/toh-pt4
  getLeaveRecord(): Observable<Request[]> {
    // console.log(this.http.get<Request[]>(this.serviceRoot))
    return this.http.get<Request[]>(this.rootURL + "/list/")
  }

  newLeaveRequest(r: LeaveRequest): Observable<any> {
    return this.http.post(this.rootURL+"/register/", JSON.stringify(r), this.httpOpts).pipe(
      catchError(this.handleError)
    );
  }

  getEmployee(): Observable<Employee> {
    return this.http.get<Employee>(this.rootURL + "/employee/")
  }

  cancelLeaveRequest(i: number): Observable<any> {
    return this.http.put(this.rootURL+"/cancel/"+ i, this.httpOpts).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
