import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParkMapComponent } from './park-map/park-map.component';


const routes: Routes = [
  { path: '', component: ParkMapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
