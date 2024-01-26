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

const createUserTemplate = (params: any) => {
  return httpRequest.get(service.CreateUserTemplate, params);
};

const sendTemplateMsg = (params: any) => {
  return httpRequest.get(service.SendTemplateMsg, params);
};

const getUserActivePermission = (params: any) => {
  return httpRequest.get(service.GetUserActivePermission, params);
}

export {
  createTemplate,
  updateTemplate,
  getTemplateList,
  deleteTemplate,
  createUserTemplate,
  sendTemplateMsg,
  getUserActivePermission,
};
