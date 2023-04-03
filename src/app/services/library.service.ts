import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { load, sync } from 'all-package-names';

import { Library } from '../library/library.model';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  libInfo = new Subject<Library>();
  libError = new Subject<boolean>();
  isLoading = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getLibStats(libName: string) {
    this.isLoading.next(true);
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
          this.libInfo.next(data);
          this.libError.next(false);
          console.log(data);
        },
        error: (err) => {
          this.isLoading.next(false);
          this.libError.next(true);
        },
      });
  }
}
