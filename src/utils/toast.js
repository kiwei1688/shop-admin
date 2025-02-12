// message component
import { ElMessage, ElMessageBox } from 'element-plus'

// 共用訊息提示
export const toast = (type = "success", message, dangerouslyUseHTMLString = true) => {
  ElMessage(
    {
      type,
      message,
      dangerouslyUseHTMLString,
      duration: 3000
    }
  )
}

// 共用提示彈窗
export const showModal = (content="提示內容", type="warning", title="" ) => {
  return ElMessageBox.confirm(
    content,
    title,
    { 
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type,
    }
  )
}