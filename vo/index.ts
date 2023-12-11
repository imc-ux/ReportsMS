export interface TemplateInfo {
  sRequestNo?: string;
  nid?: number; // 自增键值
  name?: string; // 题目
  content?: string; // 表头，多个逗号分割字符串
  element?: string; // 区分，多个逗号分割字符串
  creator?: string; // 创建者id
  creatorName?: string; // 创建者姓名
  createTime?: string; // 创建时间
  deleteTime?: string; // 删除时间
  isDelete?: string; // 是否删除
  totalCount?: string; // 总条数
}
