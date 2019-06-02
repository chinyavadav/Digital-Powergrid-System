import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaptureNodePage } from './capture-node';

@NgModule({
  declarations: [
    CaptureNodePage,
  ],
  imports: [
    IonicPageModule.forChild(CaptureNodePage),
  ],
})
export class CaptureNodePageModule {}
