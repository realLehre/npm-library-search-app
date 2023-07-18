import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
  downloadRange!: string;
  formError: boolean = false;

  constructor(
    private libService: LibraryService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: { downloadRange: string }
  ) {}

  ngOnInit(): void {
    this.compareForm = new FormGroup({
      libNames: new FormArray([
        new FormGroup({
          libraryName: new FormControl(null, Validators.required),
        }),
        new FormGroup({
          libraryName: new FormControl(null, Validators.required),
        }),
      ]),
    });

    this.downloadRange = this.data.downloadRange;
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
    if (this.compareForm.invalid) {
      this.formError = true;

      setTimeout(() => {
        this.formError = false;
      }, 2000);

      return;
    }
    this.libService.comparedLibNames.next(this.compareForm.value);
    this.libService.isComparingDownloads.next(true);
    // this.libService.getDownloads(this.downloadRange, )

    this.dialog.closeAll();
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
