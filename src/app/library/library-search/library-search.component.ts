import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { Router } from '@angular/router';
import { Library } from '../library.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient
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

    this.searchForm.valueChanges.subscribe((value) => {
      if (value.libraryName != '') {
        this.http
          .get(
            `https://www.npmjs.com/search/suggestions?q=${value.libraryName}`
          )
          .subscribe((data) => {
            console.log(data);
          });
      }
    });
  }

  onSubmit() {
    const libName = this.searchForm.value.libraryName.toLowerCase();

    this.libService.getLibStats(libName);
    this.router.navigate(['/details'], { queryParams: { lib: libName } });
    this.libService.appIsLoading.next(true);

    this.searchForm.reset();
  }

  loadLib() {
    // const libName = localStorage.getItem('libName');
    // this.router.navigate(['/details'], { queryParams: { lib: libName } });
    // this.libService.appIsLoading.next(true);
  }

  ngOnDestroy(): void {
    this.libSub.unsubscribe();
  }
}
