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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-library-details',
  templateUrl: './library-details.component.html',
  styleUrls: ['./library-details.component.scss'],
})
export class LibraryDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  isLoading: boolean = true;
  libSub!: Subscription;

  lib!: Library;
  libName!: string;
  libCurrentVersion!: string;
  libVersion: { date: string; version: string }[] = [];

  displayedColumns = ['date', 'version'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private libService: LibraryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.libName = param['lib'];
    });

    // this.libService.getLibStats(this.libName);
    // this.isLoading = true;
    // const libData: Library = JSON.parse(
    //   localStorage.getItem('libData') || '{}'
    // );

    this.libSub = this.libService.libInfo.subscribe({
      next: (data) => {
        this.getLibInfo(data);
      },
    });

    this.libService.isLoading.subscribe((status) => {
      this.isLoading = status;
    });

    // if (libData.name) {
    //   this.isLoading = false;
    //   this.getLibInfo(libData);
    // }
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

    for (const key in lib.time) {
      this.libVersion.push({
        date: lib.time[key].slice(-lib.time[key].length, 10),
        version: key,
      });
    }

    this.libVersion = this.libVersion.slice(2);
    this.dataSource.data = this.libVersion;
    console.log(this.libVersion);
    console.log(lib);
  }

  ngOnDestroy(): void {
    // this.libSub.unsubscribe();
  }
}
