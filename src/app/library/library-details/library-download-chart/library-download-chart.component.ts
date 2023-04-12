import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-library-download-chart',
  templateUrl: './library-download-chart.component.html',
  styleUrls: ['./library-download-chart.component.scss'],
})
export class LibraryDownloadChartComponent implements OnInit {
  basicData!: any;
  basicOptions!: any;

  downloadPeriod: any = [];
  donwloadCounts: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<{
        downloads: { [key: string]: { downloads: number; day: string } };
        end: string;
        package: string;
        start: string;
      }>('https://api.npmjs.org/downloads/range/last-week/vue')
      .subscribe((data) => {
        console.log(data);
        for (const key in data.downloads) {
          this.donwloadCounts.push(data.downloads[key].downloads);
          this.downloadPeriod.push(data.downloads[key].day);
        }

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
          '--text-color-secondary'
        );
        const surfaceBorder =
          documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
          labels: [...this.downloadPeriod],
          datasets: [
            {
              label: 'Downloads',
              data: [...this.donwloadCounts],
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
}
