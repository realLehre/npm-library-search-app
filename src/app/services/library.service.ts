import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataTable, Library } from '../library/library.model';
import { LibraryDownloadInterface } from '../library/library-details/library-download-chart/library-download.model';

export interface DownloadStat {
  count: number[];
  period: string[];
  comparedDownloads: any[];
}

@Injectable({ providedIn: 'root' })
export class LibraryService {
  libInfo = new Subject<Library>();
  libError = new Subject<boolean>();
  isLoading = new Subject<boolean>();
  appIsLoading = new Subject<boolean>();
  isLoadingDownload = new Subject<boolean>();

  downloadStats = new Subject<DownloadStat>();

  libDownloadCustomRange = new Subject<{ start: string; end: string }>();
  libVersion: DataTable[] = [];
  libCommonInfo = new Subject<any>();

  comparedLibNames = new Subject<any>();
  isComparingDownloads = new BehaviorSubject<boolean>(false);

  comparedPackageDownloads = new Subject<any[]>();

  constructor(private http: HttpClient) {}

  getLibStats(libName: string) {
    this.isLoading.next(true);
    this.appIsLoading.next(true);
    this.http
      .get<Library>(`https://registry.npmjs.org/${libName}`)
      .pipe(
        map((data: Library) => {
          return {
            ...data,
          };
        })
      )
      .subscribe({
        next: (data) => {
          this.isLoading.next(false);
          this.appIsLoading.next(false);
          this.libError.next(false);
          this.libInfo.next(data);

          let currentVersion = Object.keys(data.versions)[
            Object.keys(data.versions).length - 1
          ];
          if (currentVersion.charAt(0) == '0') {
            currentVersion = Object.keys(data.versions)[
              Object.keys(data.versions).length - 2
            ];
          }

          for (const key in data.time) {
            this.libVersion.push({
              date: data.time[key].slice(-data.time[key].length, 10),
              version: key,
            });
          }

          this.libVersion = this.libVersion.slice(2);

          this.libCommonInfo.next({
            currentVersion: currentVersion,
            libVersion: this.libVersion,
          });
        },
        error: (err) => {
          this.isLoading.next(false);
          this.appIsLoading.next(false);
          this.libError.next(true);
          console.log(err);
        },
      });
  }

  getDownloads(range: any, lib: string, compare: boolean) {
    this.isLoadingDownload.next(true);

    if (compare) {
      this.http
        .get<{
          [key: string]: {
            downloads: [key: { day: string; downloads: number }];
            end: string;
            package: string;
            start: string;
          };
        }>(`https://api.npmjs.org/downloads/range/${range}/npm,express`)
        .subscribe((data) => {
          this.isLoadingDownload.next(false);
          const comparedPackagesNames = [];
          const comparedPackagesDownloads: any[] = [];

          let package1: { downloads: number; day: string }[] = [];
          let package2: { downloads: number; day: string }[] = [];

          let package1Downloads: number[] = [];
          let package2Downloads: number[] = [];

          let anyPackageDay: string[] = [];

          let totalPackageDownloads: any[] = [];

          for (const key in data) {
            comparedPackagesNames.push(data[key].package);

            comparedPackagesDownloads.push(data[key].downloads);

            package1 = comparedPackagesDownloads[0];
            package2 = comparedPackagesDownloads[1];
          }

          package1.map((value, index) => {
            package1Downloads.push(value.downloads);

            anyPackageDay.push(value.day);
          });
          package2.map((value, index) => {
            package2Downloads.push(value.downloads);
          });

          totalPackageDownloads = [
            package1Downloads,
            package2Downloads,
            anyPackageDay,
            comparedPackagesNames,
          ];

          this.downloadStats.next({
            count: [],
            period: [],
            comparedDownloads: totalPackageDownloads,
          });
        });
    } else {
      this.http
        .get<LibraryDownloadInterface>(
          `https://api.npmjs.org/downloads/range/${range}/${lib}`
        )
        .subscribe((data) => {
          this.isLoadingDownload.next(false);
          const downloads = [];
          const period = [];

          for (const key in data.downloads) {
            downloads.push(data.downloads[key].downloads);
            period.push(data.downloads[key].day);
          }

          this.downloadStats.next({
            count: downloads,
            period: period,
            comparedDownloads: [],
          });

          localStorage.setItem('downloadStats', range);
        });
    }
  }

  compareDownloads() {
    this.http
      .get(`https://api.npmjs.org/downloads/range/last-month/npm,express`)
      .subscribe((value) => {});
  }

  testServer() {
    return this.http.get('http://localhost:3000/api/message');
  }
}
