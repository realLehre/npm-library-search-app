import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DownloadChartService } from 'src/app/services/download-chart-service.service';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-compare-downloads',
  templateUrl: './compare-downloads.component.html',
  styleUrls: ['./compare-downloads.component.scss'],
})
export class CompareDownloadsComponent implements OnInit {
  compareForm!: FormGroup;

  constructor(private libService: LibraryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.compareForm = new FormGroup({
      libNames: new FormArray([
        new FormGroup({
          libraryName: new FormControl(null),
        }),
        new FormGroup({
          libraryName: new FormControl(null),
        }),
      ]),
    });
  }

  get formArrayControl() {
    return (<FormArray>this.compareForm.get('libNames')).controls;
  }

  addInputs() {
    (<FormArray>this.compareForm.get('libNames')).push(
      new FormGroup({
        libraryName: new FormControl(null),
      })
    );
  }

  onSubmit() {
    this.libService.comparedLibNames.next(this.compareForm.value);

    this.dialog.closeAll();
  }
}
