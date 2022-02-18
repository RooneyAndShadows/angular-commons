import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class DateDeserializerInterceptor implements HttpInterceptor {

  // regex of ISO 8601 Date.
  DATE_TIME_TIMEZONE_REGEXP =
    /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]) (2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        event = event.clone({body: this.modifyBody(event.body)});
      }
      return event;
    }));

  }

  private modifyBody(body: any) {
    return this.deserializeDates(body);
  }

  private deserializeDates(obj: any) {
    if ((!(obj instanceof Object)) || (typeof (obj) === 'string')) {
      return obj;
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      let date;

      if ((typeof (value) === 'string') && (this.DATE_TIME_TIMEZONE_REGEXP.test(value))) {
        date = new Date(value);
        // the parsing above may fail, in which case we use isNaN to check if the date is valid
        if (isNaN(date.getTime())) {
          return;
        }
        obj[key] = date;
      }
      this.deserializeDates(value);
    }

    return obj;
  }
}
