import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-search-history',
  templateUrl: './library-search-history.component.html',
  styleUrls: ['./library-search-history.component.scss'],
})
export class LibrarySearchHistoryComponent implements OnInit {
  searchHistory: any[] = [];

  constructor(private dialog: MatDialog, private libService: LibraryService) {}

  ngOnInit(): void {
    this.searchHistory = this.libService.searchHistory;
  }

  close() {
    this.dialog.closeAll();
  }
}
