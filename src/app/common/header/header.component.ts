import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoading: boolean = false;
  constructor(private libService: LibraryService) {}

  ngOnInit(): void {
    this.libService.appIsLoading.subscribe((status) => {
      this.isLoading = status;
    });
  }
}
