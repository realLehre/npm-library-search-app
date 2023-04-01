import { Component, OnInit } from '@angular/core';
import { Library } from './library/library.model';
import { LibraryService } from './services/library.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  libData!: Library;
  isLoading!: boolean;
  libError!: String;

  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.libInfo.subscribe({
      next: (data) => {
        this.libData = data;
      },
    });

    this.libService.libError.subscribe((data) => {
      this.libError = data;
    });

    this.libService.isLoading.subscribe((status) => {
      this.isLoading = status;
    });
  }
}
