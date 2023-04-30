import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { map } from 'rxjs';

import { LibraryService } from 'src/app/services/library.service';
import { Library } from '../library.model';

@Component({
  selector: 'app-library-details',
  templateUrl: './library-details.component.html',
  styleUrls: ['./library-details.component.scss'],
})
export class LibraryDetailsComponent implements OnInit {
  lib!: Library;
  libName!: String;
  libCurrentVersion!: String;

  libVersion: { date: string; version: string }[] = [];
  columnDefs: ColDef[] = [
    { field: 'date', sortable: true },
    { field: 'version', sortable: true },
  ];
  rowData: { date: string; version: string }[] = [];

  constructor(private http: HttpClient, private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.libInfo.subscribe({
      next: (data) => {
        this.lib = data;
        this.libName = data.name;
        this.libCurrentVersion = Object.keys(data.versions)[
          Object.keys(data.versions).length - 1
        ];

        console.log(data);

        for (const key in data.time) {
          this.libVersion.push({
            date: data.time[key].slice(-data.time[key].length, 10),
            version: key,
          });
        }

        this.libVersion = this.libVersion.slice(2);
        this.rowData = this.libVersion;
      },
    });
  }
}
