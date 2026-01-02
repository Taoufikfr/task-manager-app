import 'zone.js';  // <--- ADD THIS LINE AT THE TOP
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './app/environments/environment'; // Import this

// 1. Check if config exists
console.log('Firebase Config Loaded:', environment.firebase); 

if (!environment.firebase) {
  console.error('CRITICAL ERROR: Firebase config is missing!');
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));