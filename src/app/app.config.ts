import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // تأكد من وجود هذا السطر

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // هذا السطر هو اللي بيسمح للأنجولار يحكي مع الداتا بيس
  ]
};