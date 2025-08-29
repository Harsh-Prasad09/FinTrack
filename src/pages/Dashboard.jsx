import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TransactionForm from '../components/TransactionForm'
import Charts from '../components/Charts'
import { supabase } from '../lib/supabaseClient'
import { useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, Wallet, Activity, PieChart } from 'lucide-react'

export default function Dashboard(){
  const { user, profile } = useAuth()
  const [showForm, setShowForm] = useState(null) // 'income' | 'expense' | null
  const [transactions, setTransactions] = useState([])

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!user) return
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(100)

      if(error){
        console.error('Failed loading transactions', error)
        return
      }
      if(mounted) setTransactions(data || [])
    }
    load()
    return ()=>{ mounted = false }
  }, [user])

  function openForm(mode){ setShowForm(mode) }
  function closeForm(){ setShowForm(null) }
  async function handleAdd(tx){
    // tx: { type, topic, date, amount }
    if(!user) return
    const payload = {
      user_id: user.id || user.user?.id || user?.user?.id,
      type: tx.type,
      topic: tx.topic,
      amount: tx.amount,
      currency: 'INR',
      occurred_at: tx.date,
      metadata: {}
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([payload])
      .select()

    if(error){
      console.error('Failed saving transaction', error)
      setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev])
      return
    }

    const inserted = Array.isArray(data) ? data[0] : data
    setTransactions(prev => [inserted, ...prev])
  }

  const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount), 0)
  const totalExpenses = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0)
  const currentBalance = totalIncome - totalExpenses
  const recentTransactions = transactions.slice(0, 5)

  const getName = () => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      <main className="flex-grow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Welcome Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Welcome back, {getName()}! 👋
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto text-center">
              Here's your financial overview. Track your income, expenses, and stay on top of your financial goals.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 sm:mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">Current Balance</p>
                  <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(currentBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                {currentBalance >= 0 ? (
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Positive balance
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Deficit
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                From {transactions.filter(tx => tx.type === 'income').length} transactions
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    -₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                From {transactions.filter(tx => tx.type === 'expense').length} transactions
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 sm:mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Actions</h2>
              <p className="text-slate-600 mb-6 max-w-xl mx-auto">Add income or expense fast — the dashboard will update instantly so you can keep your finances up to date.</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => openForm('income')}
                  className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Income</span>
                  <span className="sm:hidden">Income</span>
                </button>

                <button
                  onClick={() => openForm('expense')}
                  className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">Expense</span>
                </button>
              </div>

            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-white/40 max-w-md w-full">
                <TransactionForm mode={showForm} onClose={closeForm} onAdd={handleAdd} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Transactions */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-amber-600" />
                  Recent Transactions
                </h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-200/30 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {tx.type === 'income' ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{tx.topic}</div>
                          <div className="text-sm text-slate-600">
                            {new Date(tx.occurred_at || tx.date).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{Math.abs(Number(tx.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">No transactions yet</p>
                  <p className="text-sm">Add your first income or expense to get started</p>
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <PieChart className="w-6 h-6 mr-2 text-amber-600" />
                Financial Analytics
              </h3>
              <Charts transactions={transactions} />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Overview</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Get a comprehensive view of your financial health with detailed insights and spending patterns.
              </p>
              <div className="mt-4 text-sm text-slate-500">
                Total transactions: {transactions.length}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Budget Management</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Create and manage budgets to stay on track with your financial goals and spending limits.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}