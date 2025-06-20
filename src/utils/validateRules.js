// 驗證輸入內容是否合法
import { validate_account, validate_password } from '@/utils/validate';

// 帳號輸入 (管理員管理)
const username = [
  {
    required: true,
    message: "用戶名不能為空",
    trigger: "blur"
  },
  {
    min: 5,
    max: 20,
    message: "請輸入5-20個字元",
    trigger: "blur"
  },
  // { validator: validate_account }
]

const password = [
  {
    required: true,
    message: "密碼不能為空",
    trigger: "blur"
  },
  {
    min: 8,
    max: 15,
    message: "請輸入8-15個字元",
    trigger: "blur"
  },
  { validator: validate_password }
]

const role_id = [
  {
    required: true,
    message: "role不能為空",
    trigger: "blur"
  }
]

const status = [
  {
    required: true,
    message: "狀態不能為空",
    trigger: "blur" 
  }
]

const avatar = [
  {
    required: false,
    message: "頭像不能為空",
    trigger: "blur"
  }
]

// 公告標題 (公告管理)
const title = [
  {
    required: true,
    message: "公告標題不能為空",
    trigger: "blur"
  }
]

const content = [
  {
    required: true,
    message: "公告內容不能為空",
    trigger: "blur"
  }
]

export {
  username, 
  password, 
  role_id, 
  status, 
  avatar,
  title,
  content
}