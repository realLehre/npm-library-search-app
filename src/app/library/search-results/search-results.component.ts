import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryService } from '../../services/library.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  searchResults$!: Observable<string[]>;
  isFetchingSearchResults$!: Observable<boolean>;
  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.searchResults$ = this.libService.searchResults;
    this.isFetchingSearchResults$ = this.libService.isFetchingSearchResults;
  }

  onViewLib(lib: string) {
    this.libService.isTyping.next(false);
    this.libService.getLibStats(lib);
  }
}
