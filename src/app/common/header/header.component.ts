import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LibrarySearchHistoryComponent } from 'src/app/library/library-search-history/library-search-history.component';
import { LibraryService } from 'src/app/services/library.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  searchForm!: FormGroup;
  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;
  isToggled: boolean = false;
  constructor(
    private libService: LibraryService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.libService.appIsLoading.subscribe((status) => {
      this.isLoading = status;
    });

    this.searchForm = new FormGroup({
      libraryName: new FormControl('', [Validators.required]),
    });

    this.libService.isTyping.subscribe((value) => {
      if (!value) {
        this.resetInput();
      }
    });
  }

  ngAfterViewInit() {
    this.getSearch();
  }

  onToggleSearch() {
    this.isToggled = !this.isToggled;
  }

  onCloseSearch() {
    this.isToggled = false;
    this.libService.isTyping.next(false);
  }

  getSearch() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        tap(() => {
          this.libService.isFetchingSearchResults.next(true);
          if (this.searchInput.nativeElement.value === '') {
            this.libService.isTyping.next(false);
          } else {
            this.libService.isTyping.next(true);
          }
        }),
        debounceTime(300),
        distinctUntilChanged(),
        map(() => this.searchInput.nativeElement.value.toLowerCase()),
      )
      .subscribe((searchValue) => {
        this.libService.searchResults.next(
          this.libService.getLibNames(searchValue),
        );
        this.libService.isFetchingSearchResults.next(false);
        console.log(this.libService.getLibNames(searchValue));
      });
  }

  onSubmit() {
    const libName = this.searchForm.value.libraryName.toLowerCase();
    this.libService.isTyping.next(false);
    this.libService.usingHistory.next(false);
    this.libService.appIsLoading.next(true);
    this.libService.getLibStats(libName);

    this.libService.libError.subscribe((error) => {
      if (error) {
        this.router.navigate(['/error']);
      } else {
        this.router.navigate(['/details'], { queryParams: { lib: libName } });
      }
    });

    this.resetInput();
  }

  openHistory() {
    this.dialog.open(LibrarySearchHistoryComponent, {
      data: { history: '' },
      width: '500px',
      height: '230px',
    });
  }

  resetInput() {
    this.searchForm.reset();
    this.searchInput.nativeElement.blur();
  }
}
