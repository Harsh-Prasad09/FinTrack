import React, { useState } from 'react'

export default function TransactionForm({ mode = 'income', onClose, onAdd }){
  const [topic, setTopic] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [amount, setAmount] = useState('')

  const isIncome = mode === 'income'

  function handleSubmit(e){
    e.preventDefault()
    const item = { id: Date.now(), type: mode, topic, date, amount: parseFloat(amount || 0) }
    if(onAdd) onAdd(item)
    if(onClose) onClose()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isIncome ? 'Add Income' : 'Add Expense'}
          </h2>
          <p className="text-slate-600 mt-1">
            Record your {isIncome ? 'income' : 'expense'} transaction details
          </p>
        </div>
        <button 
          type="button" 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Field */}
    <div className="flex flex-col sm:flex-row items-center gap-6">
          <label className="text-sm font-medium text-slate-700 w-24 flex-shrink-0">
            Topic
          </label>
          <input 
            type="text"
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            required 
            placeholder={isIncome ? "Salary, Freelance, Business..." : "Groceries, Utilities, Entertainment..."}
      className="flex-1 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Date Field */}
    <div className="flex flex-col sm:flex-row items-center gap-6">
          <label className="text-sm font-medium text-slate-700 w-24 flex-shrink-0">
            Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
      className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-slate-900 w-full sm:w-48"
          />
        </div>

        {/* Amount Field */}
    <div className="flex flex-col sm:flex-row items-center gap-6">
          <label className="text-sm font-medium text-slate-700 w-24 flex-shrink-0">
            Amount
          </label>
          <div className="relative w-48">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
            <input 
              type="number"
              step="0.01"
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              required 
              placeholder="0.00"
              inputMode="decimal"
              className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
          <button 
            type="submit"
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-white ${
              isIncome 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Add {isIncome ? 'Income' : 'Expense'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}