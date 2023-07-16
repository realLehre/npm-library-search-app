import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { DownloadStat, LibraryService } from 'src/app/services/library.service';
import { RangeDialogComponent } from './download-range-dialog/range-dialog/range-dialog.component';
import { DownloadChartService } from 'src/app/services/download-chart-service.service';

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

  constructor(
    private libService: LibraryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private downloadChartService: DownloadChartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.libName = param['lib'];
    });

    this.libService.isLoadingDownload.subscribe((status) => {
      this.isLoading = status;
      console.log(status);
    });

    this.libService.getDownloads('last-day', this.libName);

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
  }

  ngAfterViewChecked(): void {
    this.libService.downloadStats.subscribe((data) => {
      this.downloadChartService.loadChart(data);

      this.downloadChartService.downloadChartInfo.subscribe((info) => {
        this.basicData = info.basicData;
        this.basicOptions = info.basicOptions;
        this.totalDownloadCount = info.totalDownloadCount;
      });
    });

    this.downloadChartService.downloadPeriodDisplay.subscribe((period) => {
      this.downloadPeriodDisplay = period;
    });
  }

  onSelectRange(range: any) {
    if (range == 'custom-range') {
      return;
    }

    if (range == 'today') {
      const date = moment(new Date()).format('YYYY-MM-DD');
      this.libService.getDownloads(date, this.libName);
    } else {
      this.libService.getDownloads(range, this.libName);
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

  onSelectChartType(type: string) {
    this.chartTypeIcon = type;
  }
}
