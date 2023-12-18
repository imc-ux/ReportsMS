import { Settings } from "~/constant/service";
import httpRequest from "~/server";

const getUserList = (params: any) => {
    return httpRequest.get(Settings.GetUserList, params);
};

export { getUserList };
