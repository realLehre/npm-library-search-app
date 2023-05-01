import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Subscription, map } from 'rxjs';

import { LibraryService } from 'src/app/services/library.service';
import { Library } from '../library.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-library-details',
  templateUrl: './library-details.component.html',
  styleUrls: ['./library-details.component.scss'],
})
export class LibraryDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  libSub!: Subscription;

  lib!: Library;
  libName!: String;
  libCurrentVersion!: String;
  libVersion: { date: string; version: string }[] = [];

  displayedColumns = ['date', 'version'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private libService: LibraryService) {}

  ngOnInit(): void {
    if (localStorage.getItem('libData')) {
      const libData = JSON.parse(localStorage.getItem('libData') || '{}');
      this.getLibInfo(libData);
    }

    this.libSub = this.libService.libInfo.subscribe({
      next: (data) => {
        this.getLibInfo(data);
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getLibInfo(lib: Library) {
    this.lib = lib;
    this.libName = lib.name;
    this.libCurrentVersion = Object.keys(lib.versions)[
      Object.keys(lib.versions).length - 1
    ];

    console.log(lib);

    for (const key in lib.time) {
      this.libVersion.push({
        date: lib.time[key].slice(-lib.time[key].length, 10),
        version: key,
      });
    }

    this.libVersion = this.libVersion.slice(2);
    this.dataSource.data = this.libVersion;
  }

  ngOnDestroy(): void {
    // this.libSub.unsubscribe();
  }
}
