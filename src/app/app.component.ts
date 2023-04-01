import { Component, OnInit } from '@angular/core';
import { Library } from './library-search/library.model';
import { LibraryService } from './services/library.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  libData!: Library;
  isLoading!: boolean;

  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.libInfo.subscribe({
      next: (data) => {
        this.libData = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.libService.isLoading.subscribe((status) => {
      this.isLoading = status;
    });
  }
}
