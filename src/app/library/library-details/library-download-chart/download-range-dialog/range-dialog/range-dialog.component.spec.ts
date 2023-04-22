import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeDialogComponent } from './range-dialog.component';

describe('RangeDialogComponent', () => {
  let component: RangeDialogComponent;
  let fixture: ComponentFixture<RangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
