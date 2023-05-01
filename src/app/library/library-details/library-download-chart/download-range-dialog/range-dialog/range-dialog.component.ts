import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(private dialog: MatDialog, private libService: LibraryService) {}

  ngOnInit(): void {}

  onSubmit() {
    const startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    const endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    const newRange = startDate + ':' + endDate;
    this.libService.libDownloadCustomRange.next({
      start: startDate,
      end: endDate,
    });

    this.libService.getDownloads(newRange);
    this.dialog.closeAll();
  }
}
