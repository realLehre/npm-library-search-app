import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LibraryDetailsComponent } from './library/library-details/library-details.component';
import { RangeDialogComponent } from './library/library-details/library-download-chart/download-range-dialog/range-dialog/range-dialog.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'details/:lib',
    component: LibraryDetailsComponent,
    // children: [{ path: '?custom', component: RangeDialogComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
