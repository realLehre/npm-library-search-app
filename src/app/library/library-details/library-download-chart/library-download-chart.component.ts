import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LibraryService } from 'src/app/services/library.service';
import { RangeDialogComponent } from './download-range-dialog/range-dialog/range-dialog.component';

@Component({
  selector: 'app-library-download-chart',
  templateUrl: './library-download-chart.component.html',
  styleUrls: ['./library-download-chart.component.scss'],
})
export class LibraryDownloadChartComponent implements OnInit {
  basicData!: any;
  basicOptions!: any;

  downloadPeriod: string[] = [];
  downloadCounts: number[] = [];

  totalDownloadCount: number = 0;

  foods: {
    value: string;
    viewValue: string;
  }[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  constructor(private libService: LibraryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.libService.getDownloads('2023-04-20:2023-04-21');

    this.libService.downloadStats.subscribe((data) => {
      console.log(data);

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
    });
  }

  onSelectRange(range: any) {
    this.libService.getDownloads(range);
  }

  openDialog() {
    const dialogRef = this.dialog.open(RangeDialogComponent, {
      width: '500px',
      height: '200px',
    });
  }
}
