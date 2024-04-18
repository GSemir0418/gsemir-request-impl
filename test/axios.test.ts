import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mocked } from 'vitest'
import axios from 'axios'
import { RequestImpl } from '../src/request-impl' 

vi.mock('axios', () => {
  return {
    create: vi.fn(() => ({
      defaults: { headers: { common: {} } },
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      request: vi.fn(),
    })),
  }
})

const mockedAxios = axios

describe('RequestImpl with axios', () => {
  let requestImpl: RequestImpl

  beforeEach(() => {
    const axiosInstance = mockedAxios.create()
    requestImpl = new RequestImpl(axiosInstance)
  })

  it('should perform a GET request', async () => {
    // 准备请求的返回值mock数据
    const responseData = { success: true, data: [] };

    (mockedAxios.create().request as any).mockResolvedValue({
      data: responseData,
      status: 200,
      statusText: 'OK',
    })

    const response = await requestImpl.get('https://api.example.com/data')

    expect(response.data).toEqual(responseData)
    expect(mockedAxios.create().request).toHaveBeenCalledWith({
      url: 'https://api.example.com/data',
      method: 'get',
      params: undefined,
      data: undefined,
    })
  })

  it('should perform a POST request', async () => {
    const requestData = { username: 'test', password: 'pass' }
    const responseData = { success: true };

    (mockedAxios.create().request as any).mockResolvedValue({
      data: responseData,
      status: 200,
      statusText: 'OK',
    })

    const response = await requestImpl.post('https://api.example.com/login', requestData)

    expect(response.data).toEqual(responseData)
    expect(mockedAxios.create().request).toHaveBeenCalledWith({
      url: 'https://api.example.com/login',
      method: 'post',
      params: undefined,
      data: requestData,
    })
  })
})