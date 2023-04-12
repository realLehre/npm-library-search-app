import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryDownloadChartComponent } from './library-download-chart.component';

describe('LibraryDownloadChartComponent', () => {
  let component: LibraryDownloadChartComponent;
  let fixture: ComponentFixture<LibraryDownloadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryDownloadChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryDownloadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
