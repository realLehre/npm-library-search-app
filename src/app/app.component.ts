import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Library } from './library/library.model';
import { LibraryService } from './services/library.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
