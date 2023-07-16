import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-error',
  templateUrl: './library-error.component.html',
  styleUrls: ['./library-error.component.scss'],
})
export class LibraryErrorComponent implements OnInit {
  constructor(private libService: LibraryService) {}

  ngOnInit(): void {}
}
