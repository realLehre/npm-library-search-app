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
  libAuthor!: string;

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
        if (data.author) {
          for (const key in data.author) {
            this.libAuthor = data.author[key];
          }
        }
        this.libNpm = `https://www.npmjs.com/package/${data._id}`;
        console.log(this.lib);
      },
    });

    this.libService.libCommonInfo.subscribe((info) => {
      this.libCurrentVersion = info.currentVersion;
    });
  }

  ngAfterViewInit(): void {
    this.libService.getLibStats(this.libName);
  }

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
