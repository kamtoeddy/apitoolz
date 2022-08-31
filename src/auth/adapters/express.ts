import {
  AdaptedResponse,
  CookieType,
  HeaderType,
  ObjectType,
} from "../../interfaces";

class ExpressRequestAdapter implements AdaptedResponse {
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

export const expressRequestAdapter = (res: ObjectType) =>
  new ExpressRequestAdapter(res);
