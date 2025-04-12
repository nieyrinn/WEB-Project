import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { appConfig } from './app/components/app/app.config';
import { AppComponent } from './app/components/app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    importProvidersFrom(HttpClientModule)
  ]
}).catch((err) => console.error(err));
