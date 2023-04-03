import { Component, OnInit } from '@angular/core';
import { Library } from '../library/library.model';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  libData!: Library;
  isLoading!: boolean;
  libError: boolean = false;

  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.libInfo.subscribe({
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
}
