import { service } from "~/constant/service";
import httpRequest from "~/server";

const createTemplate = (params: any) => {
  return httpRequest.get(service.CreateTemplate, params);
};

const updateTemplate = (params: any) => {
  return httpRequest.get(service.UpdateTemplate, params);
};

const getTemplateList = (params: any) => {
  return httpRequest.get(service.GetTemplateList, params);
};

const deleteTemplate = (params: any) => {
  return httpRequest.get(service.DeleteTemplate, params);
};

export { createTemplate, updateTemplate, getTemplateList, deleteTemplate };
