import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnquiriesPage } from './enquiries';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";
import { PipesModule } from "../../pipes/pipes.module";
import { RelativeTimePipe } from "../../pipes/relative-time/relative-time";

@NgModule({
  declarations: [
    EnquiriesPage,
    RelativeTimePipe
  ],
  imports: [
    IonicPageModule.forChild(EnquiriesPage),
    PipesModule
  ],
  providers: [
  	ChatServiceProvider
  ]
})
export class EnquiriesPageModule {}
