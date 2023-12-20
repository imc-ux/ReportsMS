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
  type: string[];
}
