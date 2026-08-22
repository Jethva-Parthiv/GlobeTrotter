import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { userApi } from '@/api/userApi'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/api/client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(() => getAccessToken())

  const meQuery = useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: userApi.me,
    enabled: Boolean(token),
    retry: false,
  })

  const loginWithToken = useCallback(
    (accessToken) => {
      setAccessToken(accessToken)
      setToken(accessToken)
    },
    [],
  )

  const logout = useCallback(() => {
    clearAccessToken()
    setToken(null)
    queryClient.clear()
    navigate(ROUTES.login, { replace: true })
  }, [navigate, queryClient])

  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null)
      queryClient.removeQueries({ queryKey: QUERY_KEYS.me })
      const path = location.pathname
      if (![ROUTES.login, ROUTES.signup, ROUTES.forgotPassword].includes(path) && !path.startsWith('/shared') && !path.startsWith('/discover')) {
        navigate(ROUTES.login, { replace: true, state: { from: path } })
      }
    }

    window.addEventListener('globetrotter:unauthorized', onUnauthorized)
    return () => window.removeEventListener('globetrotter:unauthorized', onUnauthorized)
  }, [location.pathname, navigate, queryClient])

  const value = useMemo(
    () => ({
      token,
      user: meQuery.data ?? null,
      isLoading: Boolean(token) && meQuery.isLoading,
      isAuthenticated: Boolean(token) && Boolean(meQuery.data),
      isAdmin: Boolean(meQuery.data?.is_admin),
      loginWithToken,
      logout,
    }),
    [loginWithToken, logout, meQuery.data, meQuery.isLoading, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
