import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveySettingsPage } from './survey-settings';

@NgModule({
  declarations: [
    SurveySettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveySettingsPage),
  ],
})
export class SurveySettingsPageModule {}
