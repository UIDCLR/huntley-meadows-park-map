import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-park-map',
  templateUrl: './park-map.component.html',
  styleUrls: ['./park-map.component.scss']
})
export class ParkMapComponent implements OnInit {

  public checkboxGroupForm: FormGroup;

  map;
  basemaps = this.getBasemaps();
  routes: any;
  currentRoute: any;
  noRouteSelectedString: string = "Select a Walking Route...";
  currentRouteName: string = this.noRouteSelectedString;
  poi_getStarted: any;
  poi_facilities: any;
  poi_localFavorites: any;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.map = this.initializeMap();
    this.checkboxGroupForm = this.formBuilder.group({
      left: true,
      middle: false,
      right: false
    });
    this.getRoutes();
    this.getPois();
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

  updateRoute(routeId) {
    switch (routeId) {
      case 1:
        try { this.map.removeLayer(this.currentRoute) } catch (err) { }
        this.currentRoute = this.routes.ddl;
        this.currentRoute.addTo(this.map);
        this.currentRouteName = "Definitive Double-Loop";
        break;
      case 2:
        try { this.map.removeLayer(this.currentRoute) } catch (err) { }
        this.currentRoute = this.routes.bb;
        this.currentRoute.addTo(this.map);
        this.currentRouteName = "Boardwalk Bend";
        break;
      case 3:
        try { this.map.removeLayer(this.currentRoute) } catch (err) { }
        this.currentRoute = this.routes.ff;
        this.currentRoute.addTo(this.map);
        this.currentRouteName = "Forest Finish";
        break;
      default:
        try { this.map.removeLayer(this.currentRoute) } catch (err) { }
        this.currentRouteName = this.noRouteSelectedString;
        break;
    }

  }

  togglePoi(poiLayer) {
    if (this.map.hasLayer(poiLayer)) {
      this.map.removeLayer(poiLayer);
    } else {
      this.map.addLayer(poiLayer);
    }
  }

  getRoutes() {
    this.http.get("/getroutes").subscribe((data: any) => {
      const routeJsons: any = {};
      for (let route of data) {
        routeJsons[route.route_name] = route.geojson;
      }
      this.routes = {
        ddl: L.geoJSON(JSON.parse(routeJsons.ddl)),
        bb: L.geoJSON(JSON.parse(routeJsons.bb)),
        ff: L.geoJSON(JSON.parse(routeJsons.ff)),
      }
    });
  }

  getPois() {

    /* Make Icons */
    let icon_getStarted = L.divIcon({
      iconSize: [8, 8],
      className: 'icon-get-started',
    });
    let icon_facilities = L.divIcon({
      iconSize: [8, 8],
      className: 'icon-facilities',
    });
    let icon_localFavorites = L.divIcon({
      iconSize: [8, 8],
      className: 'icon-local-favorites',
    });

    /* Get Started data */
    this.http.get("/get_poi_get_started").subscribe((data: any) => {
      let geoJsonString = this.getPoiGeoJsonString(data);
      this.poi_getStarted = L.geoJSON(JSON.parse(geoJsonString), {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: icon_getStarted });
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            opacity: 1,
            direction: this.getTooltipDirection(feature.properties.name)
          });
        },
      });
      this.poi_getStarted.addTo(this.map);
    });

    /* Facilities data */
    this.http.get("/get_poi_facilities").subscribe((data: any) => {
      let geoJsonString = this.getPoiGeoJsonString(data);
      this.poi_facilities = L.geoJSON(JSON.parse(geoJsonString), {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: icon_facilities });
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            opacity: 1,
            direction: this.getTooltipDirection(feature.properties.name)
          });
        },
      });
      // this.poi_facilities.addTo(this.map);
    });

    /* Local Favorites data */
    this.http.get("/get_poi_local_favorites").subscribe((data: any) => {
      let geoJsonString = this.getPoiGeoJsonString(data);
      this.poi_localFavorites = L.geoJSON(JSON.parse(geoJsonString), {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: icon_localFavorites });
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            opacity: 1,
            direction: this.getTooltipDirection(feature.properties.name)
          });
        },
      });
      // this.poi_localFavorites.addTo(this.map);
    });

  }

  getPoiGeoJsonString(data) {
    let geoJsonString = `
    {
      "type": "FeatureCollection",
      "features": [
    `;
    for (let poi of data) {
      geoJsonString += `{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [${poi.longitude}, ${poi.latitude}]
        },
        "properties": {
            "name": "${poi.poi_name}"
        }
      },`;
    }
    geoJsonString = geoJsonString.slice(0, -1) + "]}";
    return geoJsonString;
  }

  getTooltipDirection(name) {
    const nameTrim = name.trim()
    if (
      nameTrim === "Park Entrance"
      || nameTrim === "Start of Cedar Trail"
      || nameTrim === "Park Pavilion"
      || nameTrim === "Observation Deck"
      || nameTrim === "Hawk Hub"
      || nameTrim === "Woodpecker Woods"
    ) {
      return "left"
    } else if (
      nameTrim === "Parking Lot"
      || nameTrim === "Nature Center"
      || nameTrim === "Birdfeeders"
      || nameTrim === "Frog Pond"
      || nameTrim === "Environmental Monitoring Sensor"
      || nameTrim === "Observation Tower"
    ) {
      return "right"
    } else {
      return "auto"
    }
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
