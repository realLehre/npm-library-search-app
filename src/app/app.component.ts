import { Component, OnInit } from '@angular/core';

import { LibraryService } from './services/library.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;
  isTyping$!: Observable<boolean>;
  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.appIsLoading.subscribe((status) => {
      this.isLoading = status;
    });

    this.isTyping$ = this.libService.isTyping;
  }
}
