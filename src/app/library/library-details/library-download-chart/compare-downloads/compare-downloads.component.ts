import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-compare-downloads',
  templateUrl: './compare-downloads.component.html',
  styleUrls: ['./compare-downloads.component.scss'],
})
export class CompareDownloadsComponent implements OnInit {
  compareForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.compareForm = new FormGroup({
      libNames: new FormArray([
        new FormGroup({
          libraryName: new FormControl(null),
        }),
      ]),
    });
  }

  get formArrayControl() {
    return (<FormArray>this.compareForm.get('libNames')).controls;
  }

  onSubmit() {
    console.log(this.compareForm.value);
  }
}
