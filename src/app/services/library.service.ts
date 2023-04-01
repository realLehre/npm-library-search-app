import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Library } from '../library-search/library.model';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  libInfo = new Subject<Library>();
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
      .subscribe((data) => {
        this.isLoading.next(false);
        this.libInfo.next(data);
      });
  }
}
