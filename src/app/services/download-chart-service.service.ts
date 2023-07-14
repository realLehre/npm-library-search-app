import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { DownloadStat } from './library.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadChartService {
  totalDownloadCount!: number;
  basicData!: any;
  basicOptions!: any;
  downloadPeriod!: string;
  downloadPeriodDisplay = new Subject<string>();
  downloadChartInfo = new Subject<{
    basicData: any;
    basicOptions: any;
    totalDownloadCount: number;
  }>();

  constructor() {}

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

    this.downloadChartInfo.next({
      basicData: this.basicData,
      basicOptions: this.basicOptions,
      totalDownloadCount: this.totalDownloadCount,
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
