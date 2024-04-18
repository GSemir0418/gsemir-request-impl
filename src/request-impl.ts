import type { AxiosInstance, AxiosRequestConfig } from 'axios'
type RequestInstance = AxiosInstance

export class RequestImpl {
  instance: RequestInstance | undefined

  constructor(instance: RequestInstance) {
    this.instance = instance

    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      })

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        const codeMessage: Record<number, string> = {
          200: '服务器成功返回请求的数据。',
          201: '新建或修改数据成功。',
          400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
          500: '服务器发生错误，请检查服务器。'
        }
        if (error.response) {
          const { status, statusText } = error.response
          const { url } = error.response.config
          const errorText = codeMessage[status] || statusText
          alert(`请求错误 ${status}: ${url} ${errorText}`)
        }
      }
    )
  }

  get<R = unknown>(url: string, query?: Record<string, any>, config?: Omit<AxiosRequestConfig, 'method' |'params' |'url'>) {
    return this.instance?.request<R>({
      ...config,
      url,
      params: query,
      method: 'get'
    })
  }

  post<R = unknown>(url: string, data?: Record<string, any>, config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>) {
    return this.instance?.request<R>({
      ...config,
      url,
      method: 'post',
      data
    })
  }
}