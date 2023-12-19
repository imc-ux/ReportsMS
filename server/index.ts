import { UseFetchOptions, useFetch } from "nuxt/app";

type Methods = "GET" | "POST";

//const BASE_URL = "http://109.14.20.45:6636/ux/";
const BASE_URL = 'http://109.14.6.243:7777/';

export interface IResultData<T> {
    code: number;
    data: T;
    msg: string;
}

class HttpRequest {
    request<T = any>(
        url: string,
        method: Methods,
        data: any,
        options?: UseFetchOptions<T>,
    ) {
        return new Promise((resolve, reject) => {
            const newOptions: UseFetchOptions<T> = {
                baseURL: BASE_URL,
                method: method,
                ...options,
            };
            if (method === "GET") {
                let jsonString: any = encodeURIComponent(JSON.stringify(data));
                newOptions.params = { jsonString };
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

    get<T = any>(url: string, params?: any, options?: UseFetchOptions<T>) {
        return this.request(url, "GET", params, options);
    }

    post<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
        return this.request(url, "POST", data, options);
    }

}
const httpRequest = new HttpRequest();
export default httpRequest;

