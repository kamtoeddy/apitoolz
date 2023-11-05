import { Adapter, CookieType, HeaderType, ObjectType } from "../types";

class ExpressAdapter implements Adapter {
  constructor(private response: ObjectType) {}

  end = (body: any) => {
    this.response.send(body);
  };

  // with cookieParser
  setCookies = (cookies: CookieType[]) => {
    cookies.forEach((cookie: CookieType) => {
      this.response.cookie(cookie.key, cookie.value, cookie.options);
    });

    return this;
  };

  setHeaders = (headers: HeaderType) => {
    this.response.set(headers);
    
return this;
  };

  setStatusCode = (statusCode: number) => {
    this.response.status(statusCode);
    
return this;
  };
}

export const expressAdapter = (res: ObjectType) => new ExpressAdapter(res);
