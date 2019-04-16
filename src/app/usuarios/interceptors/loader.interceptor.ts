import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, 
  HttpInterceptor, 
  HttpHandler, 
  HttpRequest
} from '@angular/common/http';

import { Observable } from "rxjs";
import { finalize, delay } from "rxjs/operators";
import { LoaderService } from "../../services/loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>, 
    next: HttpHandler
    ): Observable<HttpEvent<any>> {
      console.log('URL peticiones http',req);
      if (!req.url.includes("api")) {
        return next.handle(req);
      }
      console.warn("LoaderInterceptor");
  
      const loaderService = this.injector.get(LoaderService);
  
      loaderService.show();
  
      return next.handle(req).pipe(
        delay(1000),
        finalize(() => loaderService.hide() )
      );
  }
}
