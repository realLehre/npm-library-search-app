import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataTable } from '../../library.model';
import { Subscription } from 'rxjs';

import { LibraryService } from 'src/app/services/library.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-library-version',
  templateUrl: './library-version.component.html',
  styleUrls: ['./library-version.component.scss'],
})
export class LibraryVersionComponent implements OnInit {
  lib!: string;
  libSub!: Subscription;
  libVersionInfo!: any;
  libCurrentVersion!: string;
  libVersion: DataTable[] = [];
  displayedColumns: string[] = ['date', 'version'];
  dataSource = new MatTableDataSource<DataTable>();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(
    private libService: LibraryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let libVersionInfo = localStorage.getItem('libVersion');
    this.libVersionInfo = libVersionInfo ? JSON.parse(libVersionInfo) : {};
    this.libVersion = this.libVersionInfo.libVersion;
    this.dataSource.data = this.libVersionInfo.libVersion;
  }
}
