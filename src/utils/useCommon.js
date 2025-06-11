import { ref, reactive } from 'vue'

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
      await opt.getList(curPage.value, searchForm)
      .then(res => {
        if(opt.onGetListSuccess && typeof opt.onGetListSuccess === "function") {
          opt.onGetListSuccess(res)
        } else { 
          // 成功獲取數據
          if(res.msg === "ok"){
            tableData.value = res.data.list
            total.value = res.data.totalCount
            // 獲取role數據
            // roles.value = res.data.roles
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

  // 刪除管理員 / 公告
  const handleDeleteManager = async (id) => {
    loading.value = true
  
    try {
      await opt.delete(id)
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", "成功刪除管理員")
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

  // 修改管理者 / 公告 啟用狀態
  const handleStatusChg = async (status, row) => {
    if(row.id) {
      try {
        await opt.updateStatus(row.id, status)
        .then(res => {
          // 成功獲取數據
          if(res.msg === "ok"){
            toast("success", `修改管理者啟用狀態成功`)
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

  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    curPage,
    total,
    limit,
    getData,
    handleDeleteManager,
    handleStatusChg
  }
}

// 新增 / 修改
function useInitForm() {

}

export {
  useInitTable,
  useInitForm
}
