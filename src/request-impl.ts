import type { AxiosInstance, AxiosRequestConfig } from 'axios'

type FetchInstance = typeof fetch

interface CommonRequestConfig {
  url: string
  method: string
  headers?: Record<string, string>
  body?: any
}

interface CommonResponse<R> {
  data: R
  status: number
  statusText: string
}

interface Interceptor<R> {
  request?: (config: CommonRequestConfig) => CommonRequestConfig
  response?: (response: CommonResponse<R>) => CommonResponse<R>
}

interface HttpClient<R> {
  request(config: CommonRequestConfig): Promise<CommonResponse<R>>
  interceptors?: Interceptor<R>
}

class AxiosClient<R> implements HttpClient<R> {
  axiosInstance: AxiosInstance
  interceptors?: Interceptor<R>

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  async request(config: CommonRequestConfig): Promise<CommonResponse<R>> {
    const finalConfig = this.interceptors?.request ? this.interceptors.request(config) : config

    const response = await this.axiosInstance.request<R>({
      ...finalConfig,
      params: config.method === 'get' ? config.body : undefined,
      data: config.method === 'post' ? config.body : undefined
    })

    const commonResponse = {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    }

    return this.interceptors?.response ? this.interceptors.response(commonResponse) : commonResponse
  }
}

class FetchClient<R> implements HttpClient<R> {
  interceptors?: Interceptor<R>

  async request(config: CommonRequestConfig): Promise<CommonResponse<R>> {
    // 应用请求拦截器
    const finalConfig = this.interceptors?.request ? this.interceptors.request(config) : config

    const init: RequestInit = {
      method: finalConfig.method,
      headers: finalConfig.headers,
      body: finalConfig.method === 'post' ? JSON.stringify(finalConfig.body) : undefined
    }

    const response = await fetch(config.url, init)

    const data = await response.json() as R

    const commonResponse = {
      data,
      status: response.status,
      statusText: response.statusText
    }

    return this.interceptors?.response ? this.interceptors.response(commonResponse) : commonResponse
  }
}

export class RequestImpl<R = unknown> {
  client: HttpClient<R>

  constructor(client: AxiosInstance | FetchInstance) {
    if ('request' in client) {
      this.client = new AxiosClient(client as AxiosInstance)
    } else {
      this.client = new FetchClient()
    }
  }

  async get(url: string, query?: Record<string, any>): Promise<CommonResponse<R>> {
    return this.client.request({
      url,
      method: 'get',
      body: query,
    });
  }

  async post(url: string, data?: Record<string, any>): Promise<CommonResponse<R>> {
    return this.client.request({
      url,
      method: 'post',
      body: data,
    });
  }
}