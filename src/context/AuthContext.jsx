import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({ user: null, loading: true, signOut: async () => {} })

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchProfile(userId){
      try{
        const { data, error } = await supabase.from('profiles').select('full_name, email').eq('id', userId).single()
        if(!error && data){ setProfile(data); return data }
      }catch(_err){ console.warn('fetchProfile error', _err) }
      return null
    }

    async function bootstrap() {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        if(data?.user){
          setUser(data.user)
          if(data.user.id) await fetchProfile(data.user.id)
        } else {
          setUser(null)
        }
      } catch (_err) {
        console.warn('bootstrap getUser error', _err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    bootstrap()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
      else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      try {
        listener?.subscription?.unsubscribe()
      } catch (_err) { console.warn('unsubscribe error', _err) }
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setUser(null)
      setProfile(null)
      try { localStorage.removeItem('ft_unconfirmed_auth') } catch(_err){ console.warn('localStorage remove error', _err) }
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
