import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';

import { Library } from '../library/library.model';
import { LibraryDownloadInterface } from '../library/library-details/library-download-chart/library-download.model';

export interface DownloadStat {
  count: number[];
  period: string[];
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
        },
        error: (err) => {
          this.isLoading.next(false);
          this.appIsLoading.next(false);
          this.libError.next(true);
        },
      });
  }

  getDownloads(range: any, lib: string) {
    this.isLoadingDownload.next(true);
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

        this.downloadStats.next({ count: downloads, period: period });
        localStorage.setItem('downloadStats', range);
      });
  }

  testServer() {
    return this.http.get('http://localhost:3000/api/message');
  }
}
