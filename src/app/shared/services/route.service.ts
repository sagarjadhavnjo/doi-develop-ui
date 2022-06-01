import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private history = [];

  constructor(private router: Router) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(({urlAfterRedirects}: NavigationEnd) => {
      this.history = [...this.history, urlAfterRedirects];
    });
  }

  /**
   * @description Get the route history
   * @returns route history array
   */
  public getHistory(): string[] {
    return this.history;
  }

   /**
   * @description Get the previous route
   * @returns  previous route url
   */
  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/dashboard';
  }
}
