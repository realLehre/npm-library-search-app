import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LibraryService } from '../../services/library.service';
import { Library } from '../library.model';

@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrls: ['./library-search.component.scss'],
})
export class LibrarySearchComponent implements OnInit, OnDestroy {
  libSub!: Subscription;
  searchForm!: FormGroup;
  libData!: Library;
  isLoading!: boolean;
  libError: boolean = false;

  text: string = '';

  constructor(private libService: LibraryService, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      libraryName: new FormControl('', [Validators.required]),
    });

    this.libSub = this.libService.libInfo.subscribe({
      next: (data) => {
        this.libData = data;
      },
    });

    this.libService.libError.subscribe((errorState) => {
      this.libError = errorState;
    });

    this.libService.isLoading.subscribe((status) => {
      this.isLoading = status;
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

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
