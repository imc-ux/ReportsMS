import { UseFetchOptions, useFetch } from "nuxt/app";

type Methods = "GET" | "POST";

const SERVER_URL = "http://109.14.6.43:6636/ux/";
// const SERVER_URL = "http://109.14.6.243:7777/";

class HttpRequest {
  request(url: string, method: Methods, data: any) {
    return new Promise((resolve, reject) => {
      const newOptions: UseFetchOptions<any> = {
        baseURL: SERVER_URL,
        method: method,
      };
      if (method === "GET") {
        if (typeof data === "string") {
          let jsonString: any = data;
          newOptions.params = { jsonString };
        } else {
          let jsonString: any = encodeURIComponent(JSON.stringify(data));
          newOptions.params = { jsonString };
        }
      }
      if (method === "POST") {
        newOptions.body = data;
      }
      useFetch(url, newOptions)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  get(url: string, params?: any) {
    return this.request(url, "GET", params);
  }

  post(url: string, data: any) {
    return this.request(url, "POST", data);
  }
}
const httpRequest = new HttpRequest();
export default httpRequest;
