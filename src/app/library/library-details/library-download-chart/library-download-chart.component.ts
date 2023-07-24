import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { LibraryService } from 'src/app/services/library.service';
import { RangeDialogComponent } from './download-range-dialog/range-dialog/range-dialog.component';
import { DownloadChartService } from 'src/app/services/download-chart-service.service';
import { CompareDownloadsComponent } from './compare-downloads/compare-downloads.component';
import { Subscription, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-library-download-chart',
  templateUrl: './library-download-chart.component.html',
  styleUrls: ['./library-download-chart.component.scss'],
})
export class LibraryDownloadChartComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  customRange$!: Subscription;
  downloadRange$!: Subscription;
  isCompareDownloads$!: Subscription;
  comparedLibNames$!: Subscription;
  downloadStats$!: Subscription;
  downloadPeriodDisplay$!: Subscription;

  isLoading: boolean = false;
  libName!: string;

  basicData!: any;
  basicOptions!: any;

  downloadRange: string = 'last-day';
  downloadPeriod: string[] = [];
  downloadCounts: number[] = [];

  totalDownloadCount: number = 0;
  downloadPeriodDisplay: string = 'Yesterday';

  chartTypeIcon: string = 'bar';

  isFetchingCompareData: boolean = false;
  isCompareDownloads!: boolean;
  comparedLibNames: string[] = [];
  previousLibNames: any[] = [];

  packageDownloads: number[] = [];
  packageNames: string[] = [];

  constructor(
    private libService: LibraryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private downloadChartService: DownloadChartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.libService.isCompareError.subscribe((status) => {
      if (status) {
        this.snackBar.open(
          'An error ocurred! One or more library not found',
          'Undo',
          { duration: 6000 }
        );
      }
    });

    this.route.queryParams.subscribe((param) => {
      this.libName = param['lib'];
    });

    this.libService.isLoadingDownload.subscribe((status) => {
      this.isLoading = status;
    });

    this.onSelectRange('last-day');

    this.customRange$ = this.libService.libDownloadCustomRange.subscribe(
      (data) => {
        this.downloadPeriodDisplay = `from ${data.start} to ${data.end}`;
      }
    );

    this.downloadRange$ = this.libService.downloadRange.subscribe((range) => {
      this.downloadRange = range;
    });

    this.isCompareDownloads$ = this.libService.isComparingDownloads.subscribe(
      (value) => {
        this.isCompareDownloads = value;
      }
    );

    this.comparedLibNames$ = this.libService.comparedLibNames.subscribe(
      (value) => {
        this.comparedLibNames = value;

        localStorage.setItem('libNames', JSON.stringify(value));

        this.libService.getDownloads(this.downloadRange, value, true);
      }
    );

    this.downloadStats$ = this.libService.downloadStats.subscribe((data) => {
      this.downloadChartService.loadChart(data);
    });

    this.downloadPeriodDisplay$ =
      this.downloadChartService.downloadPeriodDisplay.subscribe((period) => {
        this.downloadPeriodDisplay = period;
      });
  }

  ngAfterViewChecked(): void {
    this.libService.downloadRange.subscribe((range) => {
      this.downloadRange = range;
    });

    this.downloadChartService.downloadChartInfo
      .pipe(take(1))
      .subscribe((info) => {
        let d: any[] = [];
        this.basicData = info.basicData;
        this.basicOptions = info.basicOptions;
        this.totalDownloadCount = info.totalDownloadCount;
        if (this.isCompareDownloads) {
          d = info.comparedPackagesData.packageDownloads;
          this.packageNames = info.comparedPackagesData.packageNames;
        }

        this.packageDownloads = d;
      });

    let previousComps = localStorage.getItem('libNamesPrevious');
    this.previousLibNames = previousComps ? JSON.parse(previousComps) : [];
  }

  onSelectRange(range: any) {
    localStorage.setItem('range', range);
    if (range == 'custom-range') {
      return;
    }

    if (this.isCompareDownloads) {
      this.libService.isComparingDownloads.next(true);

      this.libService.getDownloads(range, this.comparedLibNames, true);
    } else {
      this.libService.getDownloads(range, [this.libName], false);
    }

    this.downloadChartService.periodDisplay(range);
  }

  openDialog() {
    const dialogRef = this.dialog.open(RangeDialogComponent, {
      data: { libName: this.libName },
      width: '500px',
      height: '200px',
    });
  }

  openCompareDialog(status: boolean) {
    const dialogRef = this.dialog.open(CompareDownloadsComponent, {
      data: {
        range: this.downloadRange,
        status: status,
        previousLibs: this.previousLibNames,
      },
      width: '500px',
      height: '70%',
    });
  }

  onSelectChartType(type: string) {
    this.chartTypeIcon = type;
  }

  onChartReload() {
    this.libService.isComparingDownloads.next(false);
    this.libService.getDownloads('last-day', [this.libName], false);
    this.downloadChartService.periodDisplay('last-day');
  }

  ngOnDestroy(): void {
    this.customRange$.unsubscribe();
    this.downloadRange$.unsubscribe();
    this.isCompareDownloads$.unsubscribe();
    this.comparedLibNames$.unsubscribe();
    this.downloadStats$.unsubscribe();
    this.downloadPeriodDisplay$.unsubscribe();
  }
}
