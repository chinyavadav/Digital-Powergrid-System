import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { CaptureNodePage } from '../pages/capture-node/capture-node';
import { EnquiriesPage } from '../pages/enquiries/enquiries';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { NodesPage } from '../pages/nodes/nodes';
import { ReportPage } from '../pages/report/report';
import { ReportsPage } from '../pages/reports/reports';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { SurveyPage } from '../pages/survey/survey';
import { SurveyLoginPage } from '../pages/survey-login/survey-login';
import { SurveySettingsPage } from '../pages/survey-settings/survey-settings';

import { GlobalProvider } from '../providers/global/global';
import { RelativeTimePipe } from '../pipes/relative-time/relative-time';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';


@NgModule({
  declarations: [
    MyApp,
    CaptureNodePage,
    EnquiriesPage,
    HomePage,
    LoginPage,
    MapPage,
    NodesPage,
    ReportPage,
    ReportsPage,
    RelativeTimePipe,
    SettingsPage,
    SignupPage,
    SurveyPage,
    SurveyLoginPage,
    SurveySettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CaptureNodePage,
    EnquiriesPage,
    HomePage,
    LoginPage,
    MapPage,
    NodesPage,
    ReportPage,
    ReportsPage,
    SettingsPage,
    SignupPage,
    SurveyPage,
    SurveyLoginPage,
    SurveySettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    GlobalProvider,
    ChatServiceProvider
  ]
})
export class AppModule {}
