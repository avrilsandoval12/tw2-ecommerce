import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';


bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(CarouselModule.forRoot())
  ]
}).catch((err) => console.error(err));
