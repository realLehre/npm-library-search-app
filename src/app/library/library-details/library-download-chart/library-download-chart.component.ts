import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { DownloadStat, LibraryService } from 'src/app/services/library.service';
import { RangeDialogComponent } from './download-range-dialog/range-dialog/range-dialog.component';

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

  foods: {
    value: string;
    viewValue: string;
  }[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  chartTypeIcon: string = 'bar';

  constructor(
    private libService: LibraryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.libName = param['lib'];
    });
    this.libService.isLoadingDownload.subscribe((status) => {
      this.isLoading = status;
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

    this.libService.downloadStats.subscribe((data) => {
      this.loadChart(data);
      console.log(data);
    });
  }

  ngAfterViewChecked(): void {
    // console.log(this.chartTypeIcon);
    // this.chartTypeIcon = this.chartTypeIcon;
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

    this.periodDisplay(range);
  }

  periodDisplay(range: string) {
    switch (range) {
      case (range = 'today'):
        this.downloadPeriodDisplay = 'Today';
        break;

      case (range = 'last-day'):
        this.downloadPeriodDisplay = 'Yesterday';
        break;

      case (range = 'last-month'):
        this.downloadPeriodDisplay = 'Last 30 days';
        break;

      default:
        const customRangeDisplay = JSON.parse(
          localStorage.getItem('customRangeDisplay') || '{}'
        );
        if (customRangeDisplay) {
          this.downloadPeriodDisplay = customRangeDisplay;
        }
    }
  }

  loadChart(data: DownloadStat) {
    let totalDownloadCount = 0;
    data.count.forEach((value) => {
      totalDownloadCount += value;
    });

    this.totalDownloadCount = totalDownloadCount;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: [...data.period],
      datasets: [
        {
          label: 'Downloads',
          data: [...data.count],
          fill: true,
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
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
