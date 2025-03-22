// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(), // Required for Toastr
    provideToastr({
      positionClass: 'toast-top-right', // Top-right corner
      timeOut: 3000, // Auto close after 3 seconds
      closeButton: true, // Show close button
      progressBar: true, // Show progress bar
    }),
  ],
};
