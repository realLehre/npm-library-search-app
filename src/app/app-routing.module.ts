import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LibraryDetailsComponent } from './library/library-details/library-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details', component: LibraryDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
