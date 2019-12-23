import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SeatGroup} from '../shared/model/seat-group.model';
import {Location} from '../shared/model/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService {
  private readonly _baseUrl: string;

  constructor(private _http: HttpClient) {
    this._baseUrl = environment.baseUrl;
  }

  getLocations(page: number, size: number) {
    return this._http.get(`${this._baseUrl}/locations?page=${page}&size=${size}`);
  }

  getLocation(locationId: number) {
    return this._http.get(`${this._baseUrl}/locations/${locationId}`);
  }

  searchLocations(name: string, page: number, size: number) {
    return this._http.get(`${this._baseUrl}/locations?page=${page}&size=${size}&name=${name}`);
  }

  createLocation(location: Location) {
    return this._http.post<Location>(`${this._baseUrl}/locations`, location);
  }

  editLocation(location: Location) {
    return this._http.put<Location>(`${this._baseUrl}/locations`, location);
  }

  getSeatGroups(locationId: number, page: number, size: number) {
    return this._http.get(`${this._baseUrl}/locations/${locationId}/seat-groups?page=${page}&size=${size}`);
  }

  getSeatGroup(locationId: number, seatGroupId: number) {
    return this._http.get(`${this._baseUrl}/locations/${locationId}/seat-groups/${seatGroupId}`);
  }

  createSeatGroup(locationId: number, seatGroup: SeatGroup) {
    return this._http.post<SeatGroup>(`${this._baseUrl}/locations/${locationId}/seat-groups`, seatGroup);
  }
}
