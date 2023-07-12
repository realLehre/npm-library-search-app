import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, map, take } from 'rxjs';

import { LibraryService } from 'src/app/services/library.service';
import { DataTable, Library } from '../library.model';
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
  libVersion: DataTable[] = [];
  libGithub!: string;
  libNpm!: string;

  displayedColumns: string[] = ['date', 'version'];
  dataSource = new MatTableDataSource<DataTable>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private libService: LibraryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.libName = param['lib'];
    });

    this.libService.appIsLoading.subscribe((status) => {
      this.isLoading = status;
    });

    this.libService.getLibStats(this.libName);

    this.libSub = this.libService.libInfo.pipe(take(1)).subscribe({
      next: (data) => {
        this.lib = data;
        this.libName = data.name;
        this.libGithub = data.homepage;
        this.libNpm = `https://www.npmjs.com/package/${data._id}`;
        let currentVersion = Object.keys(data.versions)[
          Object.keys(data.versions).length - 1
        ];
        if (currentVersion.charAt(0) == '0') {
          currentVersion = Object.keys(data.versions)[
            Object.keys(data.versions).length - 2
          ];
        }
        this.libCurrentVersion = currentVersion;

        for (const key in data.time) {
          this.libVersion.push({
            date: data.time[key].slice(-data.time[key].length, 10),
            version: key,
          });
        }

        this.libVersion = this.libVersion.slice(2);

        this.dataSource.data = this.libVersion;
      },
    });

    // this.libService.testServer().subscribe((data) => {
    //   console.log(data);
    // });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
