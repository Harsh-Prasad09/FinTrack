import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/FinTrack-LOGO.png" 
              alt="FinTrack" 
              className="h-11 w-11 rounded-xl shadow-md border border-slate-100" 
            />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 tracking-tight">FinTrack</div>
            <div className="text-xs text-slate-600 font-medium">Smart Finance Management</div>
          </div>
        </div>

        <nav className="flex items-center">
          {/* mobile menu button */}
          <div className="sm:hidden mr-2">
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(v => !v)}
              className="p-2 rounded-md bg-slate-100 hover:bg-slate-200"
            >
              <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isDashboard ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-700">
                    {(profile?.full_name || user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {profile?.full_name || user?.user_metadata?.full_name || user?.email || 'User'}
                </span>
              </div>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-200"
              >
                Log Out
              </button>
            </div>
          ) : (   
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                to="/login" 
                state={{ background: location }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all duration-200"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                state={{ background: location }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* mobile menu overlay */}
        {mobileOpen && (
          <div className="sm:hidden absolute right-4 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-100 z-50 w-48">
            <div className="flex flex-col py-2">
              {isDashboard ? (
                <>
                  <div className="px-4 py-2 text-sm text-slate-700">{profile?.full_name || user?.email}</div>
                  <button onClick={handleSignOut} className="text-left px-4 py-2 text-sm hover:bg-slate-50">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" state={{ background: location }} onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm hover:bg-slate-50">Log In</Link>
                  <Link to="/signup" state={{ background: location }} onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm hover:bg-slate-50">Sign In</Link>
                </>
              )}
            </div>
          </div>
  )}
      </div>
    </header>
  )
}
