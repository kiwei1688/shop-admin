// message component
import { ElMessage, ElMessageBox } from 'element-plus'

// 共用修改彈窗 父曾傳入value
export const showPrompt = (tip, value = "") => {
    return ElMessageBox.prompt(tip, '', {
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      inputValue: value
    }
  )
}
