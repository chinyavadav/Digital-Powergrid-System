import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyLoginPage } from './survey-login';

@NgModule({
  declarations: [
    SurveyLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyLoginPage),
  ],
})
export class PassengerLoginPageModule {}
