import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LibrarySearchHistoryComponent } from 'src/app/library/library-search-history/library-search-history.component';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private libService: LibraryService, private dailog: MatDialog) {}

  ngOnInit(): void {
    this.libService.appIsLoading.subscribe((status) => {
      this.isLoading = status;
    });
  }

  openHistory() {
    this.dailog.open(LibrarySearchHistoryComponent, {
      data: { history: '' },
      width: '500px',
      height: '230px',
    });
  }
}
