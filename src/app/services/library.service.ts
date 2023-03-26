import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  constructor(private http: HttpClient) {}

  getLibStats(libName: string) {
    this.http.get('https://registry.npmjs.org/react').subscribe((data) => {
      console.log(data);
    });
  }
}
