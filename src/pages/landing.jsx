import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, TrendingUp, Activity } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'

export default function Landing() {
  const location = useLocation()
  const navigate = useNavigate()
  function openSignupOnLanding() {
    navigate('/', { replace: true, state: { showSignup: true } })
  }
  const showLogin = !!(location && location.state && location.state.showLogin)
  const showSignup = !!(location && location.state && location.state.showSignup)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                    FinTrack —{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                      Money clarity
                    </span>{' '}
                    for everyday life
                  </h1>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
                    Take control of your finances with intelligent budgeting, expense tracking, 
                    and personalized insights — all in one beautiful, easy-to-use platform.
                  </p>
                </div>

                  <div className="flex flex-col sm:flex-row items-center justify-start sm:justify-center gap-4">
                    <button
                      type="button"
                      onClick={openSignupOnLanding}
                      className="group inline-flex items-center w-full sm:w-auto justify-center px-10 py-5 text-lg rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                    >
                      Try FinTrack
                      <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
              </div>

              <div className="relative">
                <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/40">
                  <div className="space-y-6">
                    {/* Dashboard Preview */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">Monthly Overview</h3>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                        <div className="text-sm text-slate-600">Total Balance</div>
                        <div className="text-2xl font-bold text-slate-900">₹4,100.00</div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-slate-200/50">
                        <div className="text-sm text-slate-600">Budget Used</div>
                        <div className="text-2xl font-bold text-slate-900">18%</div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{width: '18%'}}></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-slate-200/30">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-slate-900">Food & Dining</div>
                            <div className="text-sm text-slate-600">Today</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">-₹900.00</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-slate-200/30">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-slate-900">Pocket Money</div>
                            <div className="text-sm text-slate-600">Yesterday</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">+₹5,000.00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-slate-900">
                Everything you need for 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> smart money management</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Powerful features designed to make personal finance simple, intuitive, and stress-free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


              <div className="group">
                <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Expense Tracking</h3>
                  <p className="text-slate-600 leading-relaxed">Monitor your spending patterns with detailed analytics and visual reports that make sense of your money.</p>
                </div>
              </div>
              
              <div className="group">
                <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-time Insights</h3>
                  <p className="text-slate-600 leading-relaxed">Get instant notifications and insights about your spending habits to make better financial decisions.</p>
                </div>
              </div>

              <div className="group">
                <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Goal Planning</h3>
                  <p className="text-slate-600 leading-relaxed">Set and track financial goals with progress visualization and personalized recommendations.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to take control of your finances?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of users who have simplified their financial lives with FinTrack.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={openSignupOnLanding}
                className="group inline-flex items-center px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Start Your Free Journey
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% Free
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Secure & private
              </div>
            </div>
          </div>
        </section>
        </main>
  <Footer />
  {showLogin && <Login />}
  {showSignup && <Signup />}
    </div>
  )
}