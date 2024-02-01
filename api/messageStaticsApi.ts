import { service } from "~/constant/service";
import httpRequest from "~/server";

const getTemplateList = (params: any) => {
    return httpRequest.get(service.GetTemplateList, params);
}

const getUserTemplateList = (params: any) => {
    return httpRequest.get(service.GetUserTemplateList, params);
}

export { getTemplateList, getUserTemplateList };
