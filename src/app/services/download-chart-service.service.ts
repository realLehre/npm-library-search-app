import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { DownloadStat, LibraryService } from './library.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadChartService {
  totalDownloadCount!: number;
  basicData!: any;
  basicOptions!: any;
  downloadPeriod!: string;
  downloadPeriodDisplay = new Subject<string>();

  packageDownloads: number[] = [];
  packageNames: string[] = [];
  dataSetData: Object[] = [];

  downloadChartInfo = new Subject<{
    basicData: any;
    basicOptions: any;
    totalDownloadCount: number;
    comparedPackagesData: {
      packageDownloads: number[];
      packageNames: string[];
    };
  }>();

  isComparingDownloads: boolean = false;

  constructor(private libService: LibraryService) {
    this.libService.isComparingDownloads.subscribe((status) => {
      this.isComparingDownloads = status;
    });
  }

  loadChart(data: DownloadStat) {
    let totalDownloadCount = 0;

    let downloads: any[] = [];

    totalDownloadCount = data.count.reduce((acca, current) => {
      return acca + current;
    }, 0);

    this.totalDownloadCount = totalDownloadCount;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    if (data.compare) {
      downloads = data.comparedDownloads.comparedPackagesTotalDownloads;
    }

    if (this.isComparingDownloads) {
      const dataSetData: Object[] = [];

      this.packageNames = data.comparedDownloads.comparedPackagesNames;

      for (let d = 0; d < data.comparedDownloads.downloads.length; d++) {
        dataSetData.push({
          label: data.comparedDownloads.comparedPackagesNames[d],
          data: [...data.comparedDownloads.downloads[d]],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 1,
          tension: 0.4,
        });
      }
      this.dataSetData = dataSetData;

      if (this.dataSetData.length == data.comparedDownloads.downloads.length) {
        this.basicData = {
          labels: [...data.comparedDownloads.anyPackageDay[0]],
          datasets: [...this.dataSetData],
        };
      }
    } else {
      this.basicData = {
        labels: [...data.period],
        datasets: [
          {
            label: 'Downloads',
            data: [...data.count],
            fill: false,
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
            tension: 0.4,
          },
        ],
      };
    }

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

    this.packageDownloads = downloads;

    this.downloadChartInfo.next({
      basicData: this.basicData,
      basicOptions: this.basicOptions,
      totalDownloadCount: this.totalDownloadCount,
      comparedPackagesData: {
        packageDownloads: this.packageDownloads,
        packageNames: this.packageNames,
      },
    });
  }

  periodDisplay(range: string) {
    switch (range) {
      case (range = 'today'):
        this.downloadPeriod = 'Today';
        break;

      case (range = 'last-day'):
        this.downloadPeriod = 'Yesterday';
        break;

      case (range = 'last-month'):
        this.downloadPeriod = 'Last 30 days';
        break;

      default:
        const customRangeDisplay = JSON.parse(
          localStorage.getItem('customRangeDisplay') || '{}'
        );
        if (customRangeDisplay) {
          this.downloadPeriod = customRangeDisplay;
        }
    }

    this.downloadPeriodDisplay.next(this.downloadPeriod);
  }
}
