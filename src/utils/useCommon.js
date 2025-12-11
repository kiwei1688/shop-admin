import { ref, reactive, computed } from 'vue'
// 提示彈窗
import { toast } from "@/utils/toast";

// 表格 == 列表 / 搜索 / 分頁 / 刪除 / 修改啟用狀態  (共用方法)
function useInitTable(opt = {}) {
  const loading = ref(false)
  const tableData = ref([])

  // 分頁
  const curPage = ref(1) // 當前page
  const total = ref(0) // 總筆數
  const limit = ref(10) // 每頁顯示筆數

  // 動態接收父曾傳入要搜索的參數
  let searchForm = null
  let resetSearchForm = null

  if(opt.searchForm) {
    // 解構all 響應式參數
    searchForm = reactive({ ...opt.searchForm })
    // 重置
    resetSearchForm = () => {
      for(const [key] of Object.entries(opt.searchForm)) {
        // 重新給值
        searchForm[key] = opt.searchForm[key]
      }
      getData()
    }
  }

  // 獲取管理員列表數據
  const getData = async(page = null) => {
    // 有切換 傳入當下頁碼,則重新給當前頁籤碼
    if(typeof page === "number") curPage.value = page
    loading.value = true // 打開loading

    try {
      // 接受父層傳入的api方法獲取數據
      await opt.getList(curPage.value, searchForm)
      .then(res => {
        if(opt.onGetListSuccess && typeof opt.onGetListSuccess === "function") {
          opt.onGetListSuccess(res)
        } else { 
          // 成功獲取數據
          if(res.msg === "ok"){
            tableData.value = res.data.list
            total.value = res.data.totalCount
          }
        }
      }).finally(() => {
        loading.value = false // 關閉loading
      })
    } catch(err) {
      console.log('err ======', err)
    }
  }

  getData()

  // 刪除管理員 / 公告 / 菜單權限
  const handleDeleteManager = async (id) => {
    loading.value = true
    const name = getTitle(opt.titleName)
    try {
      await opt.delete(id)
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", `成功刪除${name}`)
          // 重新獲取數據
          getData()
        }
      }).finally(() => {
        // 關閉loading
        loading.value = false
      })
    } catch(err) {
      console.log('err ======', err)
    }
  }

  // 修改管理者 / 公告 / 菜單權限 / 角色管理 啟用狀態
  const handleStatusChg = async (status, row) => {
    const name = getTitle(opt.titleName)
    if(row.id) {
      try {
        await opt.updateStatus(row.id, status)
        .then(res => {
          // 成功獲取數據
          if(res.msg === "ok"){
            toast("success", `修改${name}狀態成功`)
            row.status = status
          }
        }).finally(() => {
          loading.value = false // 關閉loading
        })
      } catch(err) {
        console.log('err ======', err)
      }
    }
  }

  // 批量刪除功能
  // 拿到多選選中對象的id
  const miltiSelectionIds = ref([])
  const multipleTableRef = ref(null)
  // 把選中的項目的id組合成array格式
  const handleSelectionChange = (e) => {
    miltiSelectionIds.value = e.map(item => item.id)
  }
  // 執行批量刪除
  const handleMultiDelete = async () => {
    loading.value = true
    try {
      await opt.delete(miltiSelectionIds.value)
      .then(res => {
        if(res.msg === "ok") {
          toast("success", "刪除成功")
          // 清空選中 element plus提供的clearSelection()
          if(multipleTableRef.value) multipleTableRef.value.clearSelection()
          // 重新獲取數據
          getData()
        }
      }).finally(() => {
        // 關閉loading
        loading.value = false
      })
    } catch(err) {
      console.log('err ======', err)
    }
  }

  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    curPage,
    total,
    limit,
    multipleTableRef,
    getData,
    handleDeleteManager,
    handleStatusChg,
    handleSelectionChange,
    handleMultiDelete
  }
}

// 新增 / 修改
function useInitForm(opt = {}) {
  const editId = ref(0) // 0 > 新增 / 當前id > 修改
  const isTitle = computed(() => {
    const name = getTitle(opt.titleName)
    return editId.value ? `修改${name}` : `新增${name}`
    }
  )

  // 取得彈窗dom
  const formDrawerRef = ref(null)
  const formRef = ref(null)

  // form 內容
  const form = reactive({})

  // 驗證rules規則
  const rules = opt.rules || {}

  // 新增/修改 提交表單
  const handleSubmit = async () => {
    formRef.value.validate(async (valid) => {
      if(!valid) return false
      formDrawerRef.value.showLoading()
      form.status = 1 // 先給status一個預設值

      // 提交前,格式化 選擇時間區間是否轉--時間戳
      let body = {}
      opt.beforeSubmit && typeof opt.beforeSubmit === "function" ?
      body = opt.beforeSubmit({ ...form }) :
      body = form

      try {
        // 修改公告 / 新增公告
        await (editId.value ? opt.update(editId.value, body) : opt.create(body) )
        .then(res => {
          // 成功獲取數據
          if(res.msg === "ok"){
            toast("success", `${isTitle.value}成功`)
            // 修改刷新當前page / 新增 刷新第一頁
            opt.getData(editId.value ? false : 1)
            formDrawerRef.value.closeDrawer()
          }
        }).finally(() => {
          // 關閉loading
          formDrawerRef.value.closeLoading()
        })
      } catch(err) {
        console.log('err ======', err)
      }
    })
  }

  // 重置表單
  function resetForm(row = false) {
    // 有表單dom 先清除表單驗證狀態
    if(formRef.value) formRef.value.clearValidate()
  
    if(row) {
      // 更新form的表單數據
      for(const key in form) {
        form[key] = row[key]
      }
      
    }
  }

  // 新增~管理員/公告/菜單權限 彈窗
  const handleCreateNotice = () => {
    editId.value = 0 // 新增管理員
    // 重置form, 從父層傳入form的初始值
    resetForm(opt.form)
    formDrawerRef.value.openDrawer() // 開啟彈窗
  }

  // 修改公告
  const handleUpdatedNotice = async (row) => {
    editId.value = row.id // 等於當前修改id
    resetForm(row)
    formDrawerRef.value.openDrawer()
  }

  return {
    formDrawerRef,
    formRef,
    isTitle,
    form,
    rules,
    handleSubmit,
    resetForm,
    handleCreateNotice,
    handleUpdatedNotice,
  }
}

// 彈窗title name
function getTitle(key) {
  let name = ""
  const objName = {
    manager: "管理員",
    notice: "公告",
    rule: "菜單權限",
    role: "role權限",
    skus: "商品規格",
    coupon: "優惠券"
  }

  if(key in objName) name = objName[key]
  return name
}

export {
  useInitTable,
  useInitForm
}
