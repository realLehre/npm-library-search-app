import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { Router } from '@angular/router';
import { Library } from '../library.model';

@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrls: ['./library-search.component.scss'],
})
export class LibrarySearchComponent implements OnInit {
  searchForm!: FormGroup;
  libData!: Library;
  isLoading!: boolean;
  libError: boolean = false;

  constructor(private libService: LibraryService, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      libraryName: new FormControl('', Validators.required),
    });

    this.libService.libInfo.subscribe({
      next: (data) => {
        this.libData = data;
      },
    });
  }

  onSubmit() {
    // this.router.navigate(['details']);

    this.searchForm.reset();
  }

  loadLib() {
    this.libService.getLibStats(this.searchForm.value.libraryName);
    this.router.navigate(['/details']);
  }
}
