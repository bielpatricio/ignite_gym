import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/axios'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type AuthContextDataProps = {
  user: UserDTO
  handleSignIn: (email: string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
  handleSignOut: () => void
  handleUpdateUserProfile: (userUpdate: UserDTO) => Promise<void>
  refreshToken: string
}

export const AuthContext = createContext({} as AuthContextDataProps)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const [refreshToken, setRefreshedToken] = useState('')

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      await storageAuthTokenSave(token)

      // eslint-disable-next-line
  } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function handleSignIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token) {
        setIsLoadingUserStorageData(true)
        await storageUserAndTokenSave(data.user, data.token)
        await userAndTokenUpdate(data.user, data.token)
      }

      // eslint-disable-next-line
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function handleUpdateUserProfile(userUpdate: UserDTO) {
    // eslint-disable-next-line
    try {
      setUser(userUpdate)
      await storageUserSave(userUpdate)
    } catch (error) {
      throw error
    }
  }

  // async function handleSignOut() {
  const handleSignOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()

      // eslint-disable-next-line
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  // async function loadUserData() {
  const loadUserData = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token)
      }

      // eslint-disable-next-line
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  function refreshedTokenUpdated(newToken: string) {
    setRefreshedToken(newToken)
  }

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut: handleSignOut,
      refreshedTokenUpdated,
    })

    return () => {
      subscribe()
    }
  }, [handleSignOut])

  return (
    <AuthContext.Provider
      value={{
        user,
        handleSignIn,
        isLoadingUserStorageData,
        handleSignOut,
        handleUpdateUserProfile,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
