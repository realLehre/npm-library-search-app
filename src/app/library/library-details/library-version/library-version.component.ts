import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataTable } from '../../library.model';
import { Subscription, take } from 'rxjs';

import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-version',
  templateUrl: './library-version.component.html',
  styleUrls: ['./library-version.component.scss'],
})
export class LibraryVersionComponent implements OnInit, OnDestroy {
  libSub!: Subscription;
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

  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libSub = this.libService.libCommonInfo.subscribe((info) => {
      this.libVersion = info.libVersion;

      this.dataSource.data = info.libVersion;
    });
  }

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
