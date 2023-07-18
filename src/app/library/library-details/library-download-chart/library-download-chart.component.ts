import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { LibraryService } from 'src/app/services/library.service';
import { RangeDialogComponent } from './download-range-dialog/range-dialog/range-dialog.component';
import { DownloadChartService } from 'src/app/services/download-chart-service.service';
import { CompareDownloadsComponent } from './compare-downloads/compare-downloads.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-library-download-chart',
  templateUrl: './library-download-chart.component.html',
  styleUrls: ['./library-download-chart.component.scss'],
})
export class LibraryDownloadChartComponent implements OnInit, AfterViewChecked {
  isLoading: boolean = false;
  libName!: string;

  basicData!: any;
  basicOptions!: any;

  downloadPeriod: string[] = [];
  downloadCounts: number[] = [];

  totalDownloadCount: number = 0;
  downloadPeriodDisplay: string = 'Yesterday';

  chartTypeIcon: string = 'bar';

  isFetchingCompareData: boolean = false;
  isCompareDownloads!: boolean;
  comparedLibNames!: string;

  package1TotalDownload: number = 0;
  package2TotalDownload: number = 0;
  package1Name!: string;
  package2Name!: string;

  constructor(
    private libService: LibraryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private downloadChartService: DownloadChartService
  ) {}

  ngOnInit(): void {
    // this.libService.isComparingDownloads.next(false);

    this.route.queryParams.subscribe((param) => {
      this.libName = param['lib'];
    });

    this.libService.isLoadingDownload.subscribe((status) => {
      this.isLoading = status;
    });

    this.onSelectRange('last-day');

    const downloadRange = localStorage.getItem('downloadStats');

    if (downloadRange) {
      // this.libService.getDownloads(downloadRange, this.libName);
      // this.periodDisplay(downloadRange);
    } else {
    }

    this.libService.libDownloadCustomRange.subscribe((data) => {
      this.downloadPeriodDisplay = `from ${data.start} to ${data.end}`;
      localStorage.setItem(
        'customRangeDisplay',
        JSON.stringify(`from ${data.start} to ${data.end}`)
      );
    });

    this.libService.comparedLibNames.subscribe((value) => {
      let libNames: any = [];
      let range = localStorage.getItem('range');

      value.libNames.forEach((value: { [key: string]: any }) => {
        for (const key in value) {
          libNames.push(value[key]);
        }
      });

      libNames = libNames.join(',');
      this.comparedLibNames = libNames;

      localStorage.setItem('libNames', libNames);

      this.libService.getDownloads(range, libNames, true);
    });

    this.libService.isComparingDownloads.subscribe((value) => {
      this.isCompareDownloads = value;
    });

    this.libService.downloadStats.subscribe((data) => {
      this.downloadChartService.loadChart(data);
    });

    this.downloadChartService.downloadPeriodDisplay.subscribe((period) => {
      this.downloadPeriodDisplay = period;
    });
  }

  ngAfterViewChecked(): void {
    this.downloadChartService.downloadChartInfo
      .pipe(take(1))
      .subscribe((info) => {
        // this.isFetchingCompareData = false;
        this.basicData = info.basicData;
        this.basicOptions = info.basicOptions;
        this.totalDownloadCount = info.totalDownloadCount;
        if (this.isCompareDownloads) {
          this.package1Name = info.comparedPackagesData.package1Name;
          this.package2Name = info.comparedPackagesData.package2Name;
          this.package1TotalDownload =
            info.comparedPackagesData.package1Download;
          this.package2TotalDownload =
            info.comparedPackagesData.package2Download;
        }
      });
  }

  onSelectRange(range: any) {
    localStorage.setItem('range', range);
    if (range == 'custom-range') {
      return;
    }

    if (range == 'today') {
      const date = moment(new Date()).format('YYYY-MM-DD');
      if (this.isCompareDownloads) {
        this.libService.isComparingDownloads.next(true);
        this.libService.getDownloads(date, this.comparedLibNames, true);
      } else {
        this.libService.getDownloads(date, this.libName, false);
      }
    } else {
      if (this.isCompareDownloads) {
        this.libService.isComparingDownloads.next(true);
        this.libService.getDownloads(range, this.comparedLibNames, true);
      } else {
        this.libService.getDownloads(range, this.libName, false);
      }
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

  openCompareDialog() {
    const dialogRef = this.dialog.open(CompareDownloadsComponent, {
      data: { libName: this.libName },
      width: '500px',
      height: '250px',
    });
  }

  onSelectChartType(type: string) {
    this.chartTypeIcon = type;
  }
}
