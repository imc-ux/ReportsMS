import { service } from "~/constant/service";
import httpRequest from "~/server";

const getUserList = (params: any) => {
  return httpRequest.get(service.GetUserList, params);
};

const getTemplateList = (params: any) => {
  return httpRequest.get(service.GetTemplateList, params);
}

const getUserTemplateList = (params: any) => {
  return httpRequest.get(service.GetUserTemplateList, params);
}

const deleteUserTemplate = (params: any) => {
  return httpRequest.get(service.DeleteUserTemplate, params);
}

const getUserActivePermission = (params: any) => {
  return httpRequest.get(service.GetUserActivePermission, params);
}

export { getUserList, getTemplateList, getUserTemplateList, deleteUserTemplate, getUserActivePermission };
