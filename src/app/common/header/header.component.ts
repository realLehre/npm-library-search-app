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
  constructor(
    private libService: LibraryService,
    private dailog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.libService.appIsLoading.subscribe((status) => {
      this.isLoading = status;
    });

    this.searchForm = new FormGroup({
      libraryName: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit() {
    this.getSearch();
  }

  getSearch() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        map((data) => this.searchInput.nativeElement.value.toLowerCase()),
      )
      .subscribe((searchValue) => {
        console.log(searchValue);
        console.log(this.libService.getLibNames(searchValue));
      });
  }

  onSubmit() {
    const libName = this.searchForm.value.libraryName.toLowerCase();

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

    this.searchForm.reset();
  }

  openHistory() {
    this.dailog.open(LibrarySearchHistoryComponent, {
      data: { history: '' },
      width: '500px',
      height: '230px',
    });
  }
}
