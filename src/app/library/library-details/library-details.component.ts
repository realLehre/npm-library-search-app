import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LibraryService } from 'src/app/services/library.service';
import { DataTable, Library } from '../library.model';

@Component({
  selector: 'app-library-details',
  templateUrl: './library-details.component.html',
  styleUrls: ['./library-details.component.scss'],
})
export class LibraryDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
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

  pageWidth!: number;
  @ViewChild('detailsContainer') detailsContainer!: ElementRef;

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
        this.libGithub = data.repository.url;
        this.libGithub = this.libGithub.slice(4, this.libGithub.length);
        if (data.author) {
          for (const key in data.author) {
            this.libAuthor = data.author[key];
          }
        }
        this.libNpm = `https://www.npmjs.com/package/${data._id}`;
      },
    });

    this.libService.libCommonInfo.subscribe((info) => {
      this.libCurrentVersion = info.currentVersion;
    });
  }

  ngAfterViewInit(): void {
    this.libService.getLibStats(this.libName);
  }

  ngAfterViewChecked(): void {
    this.pageWidth = this.detailsContainer.nativeElement.offsetWidth;
  }

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
