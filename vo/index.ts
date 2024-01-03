export interface TemplateInfo {
  nid?: number; // 自增键值
  name?: string; // 题目
  title?: string; // 表头，多个逗号分割字符串
  element?: string; // 区分，多个逗号分割字符串
  creator?: string; // 创建者id
  changer?: string; // 修改者id
  creatorName?: string; // 创建者姓名
  createTime?: string; // 创建时间
  deleteTime?: string; // 删除时间
  isDelete?: string; // 是否删除
  totalCount?: string; // 总条数
}

export interface ComponentlistInfo {
  value: string;
  label: string;
}

export interface SetContentInfo {
  value: string;
  type: string[] | string;
}

export interface ElementsArrInfo {
  value?: string;
  type?: string;
  headersArr: HeadersArrInfo[];
}

export interface HeadersArrInfo {
  value?: string;
  inputValue?: string;
  selectedType?: string;
  type: string[] | string;
}

export interface TemplateHistory {
  nid?: number;
  userId?: string;
  templateId?: number;
  templateName?: string;
  content?: string;
  createTime?: string;
  isDelete?: string;
  userName?: string;
  dateFrom?: string;
  dateTo?: string;
  iStart?: number;
  iPageCount?: number;
  totalCount?: number;
  templateTitle?: string;
  templateElement?: string;
}

export interface SendMsgInfo {
  list?: string[][];
  type?: string;
}
