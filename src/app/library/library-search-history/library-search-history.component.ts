import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-search-history',
  templateUrl: './library-search-history.component.html',
  styleUrls: ['./library-search-history.component.scss'],
})
export class LibrarySearchHistoryComponent implements OnInit {
  searchHistory: any[] = [];

  constructor(
    private dialog: MatDialog,
    private libService: LibraryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchHistory = this.libService.searchHistory;
  }

  loadLibraryData(lib: string) {
    this.libService.usingHistory.next(true);
    this.libService.appIsLoading.next(true);
    this.libService.isComparingDownloads.next(false);

    this.libService.getLibStats(lib);

    this.libService.libError.subscribe((error) => {
      if (error) {
        this.router.navigate(['/error']);
      } else {
        this.router.navigate(['/details'], { queryParams: { lib: lib } });
      }
    });

    this.dialog.closeAll();
  }

  close() {
    this.dialog.closeAll();
  }
}
