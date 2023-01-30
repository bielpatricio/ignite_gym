import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import axios, { AxiosInstance } from 'axios'

type PromiseType = {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

type ProcessQueueParams = {
  error: Error | null
  token: string | null
}

type RegisterInterceptTokenManagerProps = {
  signOut: () => void
  refreshedTokenUpdated: (newToken: string) => void
}

type APIInstanceProps = AxiosInstance & {
  // eslint-disable-next-line
  registerInterceptTokenManager: ({}: RegisterInterceptTokenManagerProps) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.0.30:3333',
}) as APIInstanceProps

let isRefreshing = false
let failedQueue: Array<PromiseType> = []

const processQueue = ({ error, token = null }: ProcessQueueParams): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error)
    } else {
      request.resolve(token)
    }

    failedQueue = []
  })
}

api.registerInterceptTokenManager = ({ signOut, refreshedTokenUpdated }) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === 'token.expired' ||
          requestError.response.data?.message === 'token.invalid'
        ) {
          const oldToken = await storageAuthTokenGet()

          if (!oldToken) {
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequest = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return axios(originalRequest)
              })
              .catch((error) => {
                throw error
              })
          }

          isRefreshing = true

          // eslint-disable-next-line
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {
                token: oldToken,
              })
              await storageAuthTokenSave(data.token)

              api.defaults.headers.common.Authorization = `Bearer ${data.token}`
              originalRequest.headers.Authorization = `Bearer ${data.token}`

              refreshedTokenUpdated(data.token)

              processQueue({ error: null, token: data.token })

              resolve(axios(originalRequest))
            } catch (error: any) {
              processQueue({ error, token: null })
              signOut()
              reject(error)
            } finally {
              isRefreshing = false
            }
          })
        }
        console.log('outro error')
        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      } else {
        return Promise.reject(requestError)
      }
    },
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
