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
  poi_get_started: any;

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
    this.http.get("/get_poi_get_started").subscribe((data: any) => {
      console.log("poi data: ", data);
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

      let icon_getStarted = L.divIcon({
        html: `x`,
        iconSize: [20, 20],
        className: 'icon-get-started',
      });

      this.poi_get_started = L.geoJSON(JSON.parse(geoJsonString), {
        icon: icon_getStarted,
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            opacity: 0.7
          });
        },
      });

      // this.poi_get_started.bindTooltip(function (layer) {
      //   return layer.feature.properties.name;
      // }, {
      //   permanent: true,
      //   opacity: 0.7
      // })

      this.poi_get_started.addTo(this.map);

      console.log("JSON.parse(geoJsonString)", JSON.parse(geoJsonString));
      console.log("this.poi_get_started", this.poi_get_started);

      // `
      // {
      //   "type": "FeatureCollection",
      //   "features": [
      //     {
      //       "type": "Feature",
      //       "geometry": {
      //           "type": "Point",
      //           "coordinates": [102.0, 0.5]
      //       },
      //       "properties": {
      //           "prop0": "value0"
      //       }
      //     }
      //   ]
      // }
      // `
      // const routeJsons: any = {};
      // for (let route of data) {
      //   routeJsons[route.route_name] = route.geojson;
      // }
      // this.routes = {
      //   ddl: L.geoJSON(JSON.parse(routeJsons.ddl)),
      //   bb: L.geoJSON(JSON.parse(routeJsons.bb)),
      //   ff: L.geoJSON(JSON.parse(routeJsons.ff)),
      // }
    });
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

  test() {
    this.http.get("/getlocalfavorites").subscribe((data: any) => {
      console.log(">>> data:");
      console.log(JSON.parse(data));
    });

  }

}
