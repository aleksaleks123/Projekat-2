import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarComponent} from './toolbar.component';
import {MatButtonModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    RouterModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule {
}
