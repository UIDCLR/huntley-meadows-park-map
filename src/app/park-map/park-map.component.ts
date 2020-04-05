import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-park-map',
  templateUrl: './park-map.component.html',
  styleUrls: ['./park-map.component.scss']
})
export class ParkMapComponent implements OnInit {

  map;
  basemaps = this.getBasemaps();

  constructor() { }

  ngOnInit() {
    this.map = this.initializeMap();
  }

  initializeMap() {
    const map = L.map('park-map', {
      // zoomControl: false,
      attributionControl: false,
    }).setView([38.753, -77.106], 14);

    map.zoomControl.setPosition('bottomright');
    L.control.scale({
      position: "bottomleft"
    }).addTo(map);

    /* Initial basemap */
    map.addLayer(this.basemaps.Stamen_Watercolor);
    map.addLayer(this.basemaps.Esri_WorldImagery);
    map.addLayer(this.basemaps.MapBox_StamenWatercolorParkOverlay2);
    // map.addLayer(OpenStreetMap);

    return map;
  }

  getBasemaps() {
    return {
      MapBox_StamenWatercolorParkOverlay2: L.tileLayer('https://api.mapbox.com/styles/v1/corylrwisc/ck8dvx2bu1crz1iqsekh7z0qb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY29yeWxyd2lzYyIsImEiOiJjaXkzdGllZmEwMDBtMzNyemNhaWxlN3h5In0.t0iSfDDNY9DDB0Yn1gU1ew', {
        minZoom: 14,
        maxZoom: 18,
        className: "basemap-basic-transparent-background",
      }),
      Stamen_Watercolor: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 14,
        maxZoom: 16,
        ext: 'jpg',
        className: "basemap-watercolor",
      }),
      Esri_WorldImagery: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: 17,
        maxZoom: 18,
      }),
    }
  }

}
