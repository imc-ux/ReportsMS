import { service } from "~/constant/service";
import httpRequest from "~/server";

const getUserList = (params: any) => {
  return httpRequest.get(service.GetUserList, params);
};

export { getUserList };
