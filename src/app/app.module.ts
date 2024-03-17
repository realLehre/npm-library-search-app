import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ChartModule } from 'primeng/chart';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentDateModule } from '@angular/material-moment-adapter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { LibrarySearchComponent } from './library/library-search/library-search.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { LibraryDetailsComponent } from './library/library-details/library-details.component';
import { LibraryDownloadChartComponent } from './library/library-details/library-download-chart/library-download-chart.component';
import {
  MY_DATE_FORMATS,
  RangeDialogComponent,
} from './library/library-details/library-download-chart/download-range-dialog/range-dialog/range-dialog.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { LoaderComponent } from './common/loader/loader.component';
import { LibraryVersionComponent } from './library/library-details/library-version/library-version.component';
import { LibraryService } from './services/library.service';
import { LibraryErrorComponent } from './library/lib-error/library-error.component';
import { CompareDownloadsComponent } from './library/library-details/library-download-chart/compare-downloads/compare-downloads.component';
import { ShortenTextPipe } from './library/shorten-text.pipe';
import { LibrarySearchHistoryComponent } from './library/library-search-history/library-search-history.component';
import { SocialLinksComponent } from './common/social-links/social-links.component';
import { SearchResultsComponent } from './library/search-results/search-results.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LibrarySearchComponent,
    HomeComponent,
    LibraryDetailsComponent,
    LibraryDownloadChartComponent,
    RangeDialogComponent,
    LoaderComponent,
    LibraryVersionComponent,
    LibraryErrorComponent,
    CompareDownloadsComponent,
    ShortenTextPipe,
    LibrarySearchHistoryComponent,
    SocialLinksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule,
    ChartModule,
    BrowserAnimationsModule,
    MomentDateModule,
    SearchResultsComponent,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    LibraryService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
