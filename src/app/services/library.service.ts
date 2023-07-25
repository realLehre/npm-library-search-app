import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataTable, Library } from '../library/library.model';
import { LibraryDownloadInterface } from '../library/library-details/library-download-chart/library-download.model';

export interface DownloadStat {
  count: number[];
  period: string[];
  comparedDownloads: {
    downloads: any[];
    anyPackageDay: string[];
    comparedPackagesNames: string[];
    comparedPackagesTotalDownloads: number[];
  };
  compare: boolean;
}

@Injectable({ providedIn: 'root' })
export class LibraryService {
  libInfo = new Subject<Library>();
  libError = new Subject<boolean>();
  isLoading = new Subject<boolean>();
  appIsLoading = new Subject<boolean>();
  isLoadingDownload = new Subject<boolean>();

  downloadStats = new Subject<DownloadStat>();
  downloadRange = new Subject<string>();

  libDownloadCustomRange = new Subject<{ start: string; end: string }>();
  libVersion: DataTable[] = [];
  libCommonInfo = new Subject<any>();
  searchHistory: string[] = [];
  usingHistory = new BehaviorSubject<boolean>(false);

  isComparingDownloads = new BehaviorSubject<boolean>(false);
  isCompareError = new Subject<boolean>();
  comparedLibNames = new Subject<string[]>();
  previousLibNames: any[] = [];

  compareFormHeight = new BehaviorSubject<number>(180);

  constructor(private http: HttpClient) {
    let previousComps = localStorage.getItem('libNamesPrevious');
    this.previousLibNames = previousComps ? JSON.parse(previousComps) : [];

    let history = localStorage.getItem('search-history');
    this.searchHistory = history ? JSON.parse(history) : [];
  }

  getLibStats(libName: string) {
    this.isLoading.next(true);
    this.appIsLoading.next(true);

    this.http.get<Library>(`https://registry.npmjs.org/${libName}`).subscribe({
      next: (data) => {
        this.isLoading.next(false);
        this.appIsLoading.next(false);
        this.libError.next(false);

        this.libInfo.next(data);
        let libVersion: any[] = [];

        let currentVersion = Object.keys(data.versions)[
          Object.keys(data.versions).length - 1
        ];
        if (currentVersion.charAt(0) == '0') {
          currentVersion = Object.keys(data.versions)[
            Object.keys(data.versions).length - 2
          ];
        }

        for (const key in data.time) {
          libVersion.push({
            date: data.time[key].slice(-data.time[key].length, 10),
            version: key,
          });
        }

        this.libVersion = libVersion;
        this.libVersion = this.libVersion.slice(2);

        this.libCommonInfo.next({
          currentVersion: currentVersion,
          libVersion: this.libVersion,
        });

        localStorage.setItem(
          'libVersion',
          JSON.stringify({
            currentVersion: currentVersion,
            libVersion: this.libVersion,
          })
        );
      },
      error: (err) => {
        this.isLoading.next(false);
        this.appIsLoading.next(false);
        this.libError.next(true);
        console.log(err);
      },
    });
  }

  async getDownloads(range: any, libNames: string[], compare: boolean) {
    this.isLoadingDownload.next(true);
    this.downloadRange.next(range);

    const downloads: any[] = [];
    const periods: any[] = [];
    const eachTotalDownloadCount: any[] = [];
    let comparedPackages: {
      downloads: any[];
      anyPackageDay: string[];
      comparedPackagesNames: string[];
      comparedPackagesTotalDownloads: number[];
    };

    if (compare) {
      for (let d = 0; d < libNames.length; d++) {
        await new Promise((resolve) => {
          this.http
            .get<LibraryDownloadInterface>(
              `https://api.npmjs.org/downloads/range/${range}/${libNames[d]}`
            )
            .subscribe({
              next: (data) => {
                resolve(data);
                const eachDownloads: number[] = [];
                const eachPeriod: string[] = [];
                let totalDownloads = 0;

                for (const key in data.downloads) {
                  eachDownloads.push(data.downloads[key].downloads);
                  eachPeriod.push(data.downloads[key].day);
                }
                downloads.push(eachDownloads);
                periods.push(eachPeriod);

                eachDownloads.forEach((download) => {
                  totalDownloads += download;
                });

                eachTotalDownloadCount.push(totalDownloads);
              },
              error: (err) => {
                this.isLoadingDownload.next(false);
                this.isComparingDownloads.next(false);
                this.isCompareError.next(true);
              },
            });
        });
      }

      comparedPackages = {
        downloads: downloads,
        anyPackageDay: periods,
        comparedPackagesNames: libNames,
        comparedPackagesTotalDownloads: eachTotalDownloadCount,
      };
      this.isLoadingDownload.next(false);

      this.downloadStats.next({
        count: [],
        period: [],
        comparedDownloads: comparedPackages,
        compare: true,
      });

      const libNamesRe = libNames;

      if (this.previousLibNames.length != 0) {
        if (libNamesRe.toString() !== this.previousLibNames[0].toString()) {
          this.previousLibNames.unshift(libNames);
          localStorage.setItem(
            'libNamesPrevious',
            JSON.stringify(this.previousLibNames)
          );
        } else {
          return;
        }
      } else {
        localStorage.setItem('libNamesPrevious', JSON.stringify([libNames]));
      }
    } else {
      this.http
        .get<LibraryDownloadInterface>(
          `https://api.npmjs.org/downloads/range/${range}/${libNames}`
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
            comparedDownloads: {
              downloads: [],
              anyPackageDay: [],
              comparedPackagesNames: [],
              comparedPackagesTotalDownloads: [],
            },
            compare: false,
          });

          if (this.searchHistory.length == 0) {
            this.searchHistory = libNames;
            localStorage.setItem('search-history', JSON.stringify(libNames));
          } else if (
            this.searchHistory.some((history: string) => history == libNames[0])
          ) {
            return;
          } else {
            this.searchHistory.unshift(...libNames);

            if (this.searchHistory.length > 5) {
              this.searchHistory = this.searchHistory.slice(0, 5);
            }

            localStorage.setItem(
              'search-history',
              JSON.stringify(this.searchHistory)
            );
          }

          localStorage.setItem('downloadStats', range);
        });
    }
  }
}
