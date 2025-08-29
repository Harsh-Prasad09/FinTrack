import React, {useState} from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  function openSignupOnLanding(){
    navigate('/', { replace: true, state: { showSignup: true } })
  }

  function handleClose(){
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error) {
      const msg = (error.message || '').toLowerCase()
      const confirmationKeywords = ['confirm', 'confirmation', 'verify', 'verified']
      const isConfirmationIssue = confirmationKeywords.some(k => msg.includes(k))
      if(isConfirmationIssue){
        try{ localStorage.setItem('ft_unconfirmed_auth', '1') }catch(_err){ console.warn('localStorage set error', _err) }
        navigate('/dashboard')
        return
      }

      setError(error.message)
      return
    }
    // successful sign-in
    try{ localStorage.removeItem('ft_unconfirmed_auth') }catch(_err){ console.warn('localStorage remove error', _err) }

    // fetch current user and ensure profile row exists when full_name is present
    try{
      const { data } = await supabase.auth.getUser()
      const current = data?.user
      const name = current?.user_metadata?.full_name
      if(current?.id){
        await supabase.from('profiles').upsert({ id: current.id, full_name: name || null, email: current.email })
      }
    }catch(_err){ console.warn('post-login fetch/upsert error', _err) }

    navigate('/dashboard')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative" onClick={e=>e.stopPropagation()}>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100"
          >
            <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your FinTrackr account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label htmlFor="email" className="w-full sm:w-32 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 text-orange-600" />
                <span>Email</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label htmlFor="password" className="w-full sm:w-32 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 text-orange-600" />
                <span>Password</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={openSignupOnLanding}
                className="font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200"
              >
                Create one now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}