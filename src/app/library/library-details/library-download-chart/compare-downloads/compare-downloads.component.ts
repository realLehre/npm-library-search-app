import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

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

  get formArray() {
    return <FormArray>this.compareForm.get('libNames');
  }

  get formArrayControl() {
    return (<FormArray>this.compareForm.get('libNames')).controls;
  }

  addInputs() {
    (<FormArray>this.compareForm.get('libNames')).push(
      new FormGroup({
        libraryName: new FormControl(null, Validators.required),
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
    this.libService.isComparingDownloads.next(true);

    const libNames: string[] = [];
    this.compareForm.value.libNames.forEach((name: { libraryName: string }) => {
      libNames.push(name.libraryName.toLowerCase());
    });

    this.libService.comparedLibNames.next(libNames);

    this.dialog.closeAll();
  }

  removeInput(index: number) {
    this.formArray.removeAt(index);
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
