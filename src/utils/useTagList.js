import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'

// 使用vueuse cookie套件處理cookie
import { useCookies } from '@vueuse/integrations/useCookies'

// 上方導航標籤
export function useTagList(){
  const route = useRoute()
  const router = useRouter()
  const cookie = useCookies()

  // 選中對應的path
  const activeTab = ref(route.path)
  const tabList = ref([
    {
      title: '後臺首頁',
      path: '/'
    },
  ])

  // 添加標籤導航
  const addTab = (tab) => {
    // 檢查tabList是否有此筆數據,-1為找不到
    const noData = tabList.value.findIndex(el => el.path === tab.path) === -1
    // 沒有該數據 => push進去
    if(noData) {
      tabList.value.push(tab)
    }
    // 重新存入cookie
    cookie.set("tabList", tabList.value)
  }

  // 監聽route切換-> 有切換就調用
  onBeforeRouteUpdate((to, from) => {
    // 選中state
    activeTab.value = to.path

    // {title: '分類列表', path: '/category/list'}
    const tabObj = { 
      title: to.meta.title, 
      path: to.path 
    }

    addTab(tabObj)
  })

  // 點標籤導航導向對應頁面
  const changeTab = (path) => {
    // 對應的route path
    activeTab.value = path
    router.push(path)
  }

  // 移除導航標籤
  // 需求: 移除當下標籤,則下一個標籤是選中狀態
  const removeTab = (curPath) => {
      // curPath => 當前路徑
      let tabs = tabList.value
      let a = activeTab.value

      // 刪除當下選中標籤
      if(a === curPath) {
        tabs.forEach((item, index) => {
          // 選中當下標籤
          if(item.path === curPath) {
            // 上一個or下一個標籤
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if(nextTab) {
              a = nextTab.path
            }
          }
        })
      }

      activeTab.value = a
      router.push(a)
      // 過濾掉刪除的標籤
      tabList.value = tabList.value.filter(item => item.path !== curPath)

      cookie.set("tabList", tabList.value)
  }

  // 標籤導航 關閉全部 & 關閉其他
  const handleClose = (key) => {
    switch (key) {
      case "clearAll":
        activeTab.value = "/"
        // 過濾只剩首頁
        tabList.value = [
        {
          title: '後臺首頁',
          path: '/'
        },
        ]
        break
      case "clearOther":
        // 過濾只剩首頁&當前選中導航標籤,其他關閉
        tabList.value = tabList.value.filter(item => item.path === "/" || item.path === activeTab.value )
        break
      default:
        break
    }

    router.push(activeTab.value)
    cookie.set("tabList", tabList.value)
  } 

  // 初始化標籤導航列表
  const initTabList = () => {
    let tabs = cookie.get("tabList")
    if(tabs) tabList.value = tabs
  }

  initTabList()

  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
  }
}