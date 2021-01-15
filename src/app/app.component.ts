import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const { StatusBar, SplashScreen } = Plugins;
    try {
      await SplashScreen.hide();
      await StatusBar.setStyle({
        style: StatusBarStyle.Dark
      });/* 
      if (this.platform.is('android')){
        StatusBar.setBackgroundColor({
          color: '#631c19'
        });
      } */
    } catch (error ){
      console.log('Navegador normal', error);
    }

  }
}
