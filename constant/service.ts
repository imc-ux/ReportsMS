export enum service {
  GetUserList = "getUserList",
  CreateTemplate = "createTemplate", //创建模板
  GetTemplateList = "getTemplateList", //模板管理检索
  DeleteTemplate = "deleteTemplate", //模板管理删除
  UpdateTemplate = "updateTemplate", //模板管理修改
  GetUserTemplateList = "getUserTemplateList", //消息管理检索
  DeleteUserTemplate = "deleteUserTemplate", //消息管理删除
  CreateUserTemplate = "createUserTemplate", //创建消息
  SendTemplateMsg = "chat-sendTemplateMsg", //发送消息
  GetUserActivePermission = 'getUserActivePermission',//权限管理
  UpdateUserTemplate = 'updateUserTemplate',//管理
}
