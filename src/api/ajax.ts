// 类型声明在 axios\index.d.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import NProgress from 'nprogress'
import { ResultData } from '@/type'
import { ElMessage } from 'element-plus'
import router from '@/router'
// 创建实例
const service: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    NProgress.start()
    return config
  },
  error => {
    console.log('发起请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse): ResultData | void => {
    NProgress.done()
    if(response.request.responseType == 'blob') {
      // 文件下载
      downloadFile(response)
      return
    }

    const res: ResultData = response.data
    if (res.code == 200) {
      return res
    }

    // 提示
    ElMessage.error(res.message)
    // 未登录
    if (res.code === 401) {
      if (router.currentRoute.value.path === '/login') {
        return
      }else{
        location.reload()
      }
    }else if (res.code === 403) {
      location.reload()
    }
    
  },
  error => {
    NProgress.done()
    return Promise.reject(error)
  }
)

// 文件下载
function downloadFile(res: AxiosResponse) {
  // 创建一个类文件对象，Blob表示一个不可变、原始数据的类文件对象
  const blob = new Blob([res.data], { type: "application/xlsx"})
  // 文件名
  let fileName = decodeURI(res.headers['content-disposition'])
  if (fileName) {
    fileName = fileName.substring(fileName.indexOf('=') + 1)
  }
  const link = document.createElement('a')  //创建一个a标签
  link.download = fileName   //下载属性
  link.style.display = 'none' //隐藏
  link.href = URL.createObjectURL(blob)  // 处理好的地址赋值给a标签
  document.body.appendChild(link) // 添加到页面
  link.click()  //  点击
  URL.revokeObjectURL(link.href)  // 是否对象
  document.body.removeChild(link) // 移除标签
}

export default service
