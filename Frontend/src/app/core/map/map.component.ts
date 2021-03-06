import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() private _latitude: number;
  @Input() private _longitude: number;
  @Input() private _zoom: number;
  @Input() private _maxZoom: number;
  @Input() private _draggable: boolean;
  @Output() private markerDrag: EventEmitter<any> = new EventEmitter<any>();

  private _map;
  @Input() private _mapName: string;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  private initMap(): void {
    this._map = L.map(`${this._mapName}map`).setView([this._latitude, this._longitude], this._zoom);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: this._maxZoom,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiZHJhZ2FuOTciLCJhIjoiY2s0OHdkbnN6MDQ1azNubW1qYXN3MWhnOSJ9.IorNULTY9svXvs1aVmNesg'
    }).addTo(this._map);

    const marker = L.marker([this._latitude, this._longitude],
      {
        draggable: this._draggable
      });

    if (this._draggable) {
      marker._on('dragend', (event) => {
        this.markerDrag.emit(event.target.getLatLng());
      });
    }

    marker.addTo(this._map);
  }

}
