import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, retry, throwError } from 'rxjs';
import { Launch, Launchpad, Payload, Rocket } from '../interface/Interface';

@Injectable({
  providedIn: 'root',
})
export class SpacexApiService {
  private base = 'https://api.spacexdata.com/v4';

  constructor(private http: HttpClient) {}

  private handleError(err: any) {
    console.error(err);
    return throwError(() => new Error(err.message || 'API error'));
  }

  getPast(limit = 0, offset = 0): Observable<Launch[]> {
    const params: any = {};
    if (limit) {
      params.limit = limit;
      params.offset = offset;
    }
    return this.http
      .get<Launch[]>(`${this.base}/launches/past`, { params })
      .pipe(
        retry(2),
        catchError((err) => this.handleError(err))
      );
  }

  getUpcoming(): Observable<Launch[]> {
    return this.http.get<Launch[]>(`${this.base}/launches/upcoming`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }

  getById(id: string): Observable<Launch> {
    return this.http.get<Launch>(`${this.base}/launches/${id}`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }

  getRocket(id: string): Observable<Rocket> {
    return this.http.get<Rocket>(`${this.base}/rockets/${id}`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }

  getPayload(id: string): Observable<Payload> {
    return this.http.get<Payload>(`${this.base}/payloads/${id}`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }

  getAllLaunchpads(): Observable<Launchpad[]> {
    return this.http.get<Launchpad[]>(`${this.base}/launchpads`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }
  getAllPayloads(): Observable<Payload[]> {
    return this.http.get<Payload[]>(`${this.base}/payloads`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }
  getAllRockets(): Observable<Rocket[]> {
    return this.http.get<Rocket[]>(`${this.base}/rockets`).pipe(
      retry(2),
      catchError((err) => this.handleError(err))
    );
  }
}
