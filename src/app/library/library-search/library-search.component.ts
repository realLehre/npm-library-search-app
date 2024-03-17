import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';

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

  constructor(
    private libService: LibraryService,
    private router: Router,
  ) {}

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

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
