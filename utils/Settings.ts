import Storage, { StorageType } from "@/utils/Storage";

export const UserInfo = {
  get userId(): string {
    return Storage.getSessionItem(StorageType.UserId);
  },

  get UserName(): string {
    return Storage.getSessionItem(StorageType.UserName);
  },

  get UserPermission(): string {
    return Storage.getSessionItem(StorageType.UserPermission);
  },

  get Figure(): string {
    return Storage.getSessionItem(StorageType.Figure);
  },
};

export function getServerUrl() {
  return document.location.protocol + "//" + document.location.host + "";
}

