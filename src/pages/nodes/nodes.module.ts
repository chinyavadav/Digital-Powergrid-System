import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NodesPage } from './nodes';

@NgModule({
  declarations: [
    NodesPage,
  ],
  imports: [
    IonicPageModule.forChild(NodesPage),
  ],
})
export class NodesPageModule {}
