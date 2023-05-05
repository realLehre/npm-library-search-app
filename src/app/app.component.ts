import { Component, OnInit } from '@angular/core';

import { LibraryService } from './services/library.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;
  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.isLoading.subscribe((status) => {
      this.isLoading = status;
    });
  }
}
