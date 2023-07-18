import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { LibraryService } from 'src/app/services/library.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-range-dialog',
  templateUrl: './range-dialog.component.html',
  styleUrls: ['./range-dialog.component.scss'],
})
export class RangeDialogComponent implements OnInit {
  libName!: string;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  isComparingDownloads: boolean = false;
  constructor(
    private dialog: MatDialog,
    private libService: LibraryService,
    @Inject(MAT_DIALOG_DATA) private data: { libName: string }
  ) {}

  ngOnInit(): void {
    this.libName = this.data.libName;

    this.libService.isComparingDownloads.subscribe((value) => {
      this.isComparingDownloads = value;
    });
  }

  onSubmit() {
    if (this.range.value.start == null || this.range.value.end == null) {
      this.dialog.closeAll();

      return;
    }

    const startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    const endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    const newRange = startDate + ':' + endDate;

    localStorage.setItem(
      'customRange',
      JSON.stringify({
        start: startDate,
        end: endDate,
      })
    );

    const customRange = JSON.parse(localStorage.getItem('customRange') || '{}');

    if (customRange) {
      this.updateCustomRange(customRange.start, customRange.end);
    } else {
      this.updateCustomRange(startDate, endDate);
    }

    this.dialog.closeAll();
  }

  updateCustomRange(start: string, end: string) {
    this.libService.libDownloadCustomRange.next({
      start: start,
      end: end,
    });
    if (this.isComparingDownloads) {
      let libNames = localStorage.getItem('libNames');
      if (libNames) {
        this.libService.isComparingDownloads.next(true);

        this.libService.getDownloads(start + ':' + end, libNames, true);
      }
    } else {
      this.libService.isComparingDownloads.next(false);

      this.libService.getDownloads(start + ':' + end, this.libName, false);
    }
  }
}
