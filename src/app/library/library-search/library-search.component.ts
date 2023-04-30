import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrls: ['./library-search.component.scss'],
})
export class LibrarySearchComponent implements OnInit {
  searchForm!: FormGroup;

  constructor(private libService: LibraryService, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      libraryName: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.libService.getLibStats(this.searchForm.value.libraryName);

    this.router.navigate(['details']);

    this.searchForm.reset();
  }
}
