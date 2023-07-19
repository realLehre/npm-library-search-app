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

  package1TotalDownload: number = 0;
  package2TotalDownload: number = 0;
  package1Name!: string;
  package2Name!: string;

  downloadChartInfo = new Subject<{
    basicData: any;
    basicOptions: any;
    totalDownloadCount: number;
    comparedPackagesData: {
      package1Download: number;
      package2Download: number;
      package1Name: string;
      package2Name: string;
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

    if (this.isComparingDownloads) {
      if (data.comparedDownloads[3]) {
        [this.package1Name, this.package2Name] = data.comparedDownloads[3];
      }

      let download1 = 0;
      data.comparedDownloads[0].forEach((download: number) => {
        if (data.comparedDownloads[0].length == 1) {
          download1 = download;
        } else {
          download1 += download;
        }
      });
      this.package1TotalDownload = download1;

      let download2 = 0;
      data.comparedDownloads[1].forEach((download: number) => {
        if (data.comparedDownloads[1].length == 1) {
          download2 = download;
        } else {
          download2 += download;
        }
      });
      this.package2TotalDownload = download2;

      this.basicData = {
        labels: [...data.comparedDownloads[2]],
        datasets: [
          {
            label: this.package1Name,
            data: [...data.comparedDownloads[0]],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            borderWidth: 1,
            tension: 0.4,
          },
          {
            label: this.package2Name,
            data: [...data.comparedDownloads[1]],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--pink-500'),
            borderColor: documentStyle.getPropertyValue('--pink-500'),
            borderWidth: 1,
            tension: 0.4,
          },
        ],
      };
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

    this.downloadChartInfo.next({
      basicData: this.basicData,
      basicOptions: this.basicOptions,
      totalDownloadCount: this.totalDownloadCount,
      comparedPackagesData: {
        package1Download: this.package1TotalDownload,
        package2Download: this.package2TotalDownload,
        package1Name: this.package1Name,
        package2Name: this.package2Name,
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
