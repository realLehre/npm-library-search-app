import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  exports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatTooltipModule],
})
export class MaterialModule {}
