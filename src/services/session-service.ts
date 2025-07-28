import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionService {
  constructor() { }

  setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value)); // Store as string
  }

  getItem(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null; // Parse back to original type
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearAll(): void {
    sessionStorage.clear();
  }
}