import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })

    // redirect to homepage
    window.location.href =  import.meta.env.VITE_REACT_APP_HOMEPAGE  
  }

  return { logout }
}