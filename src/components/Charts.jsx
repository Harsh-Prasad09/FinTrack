import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList
} from 'recharts'

const EXPENSE_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#FB7185', '#F43F5E']
const INCOME_COLORS = ['#10B981', '#34D399', '#06B6D4', '#60A5FA', '#7C3AED']

function monthKey(dateStr){
  const d = new Date(dateStr)
  if(isNaN(d)) return dateStr
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}

export default function Charts({ transactions = [] }){
  const {
    monthlyTotals,
    monthlyNet,
    expenseByCategory,
    incomeByCategory
  } = useMemo(()=>{
    const monthlyMap = {}
    const expenseCat = {}
    const incomeCat = {}

    transactions.forEach(tx => {
      const date = tx.occurred_at || tx.date || tx.created_at
      const mKey = monthKey(date)
      const amt = Math.abs(Number(tx.amount) || 0)
      const type = tx.type === 'income' ? 'income' : 'expense'
      if(!monthlyMap[mKey]) monthlyMap[mKey] = { month: mKey, income: 0, expense: 0 }
      monthlyMap[mKey][type] += amt

      const topic = (tx.topic || 'Other').trim() || 'Other'
      if(type === 'expense') expenseCat[topic] = (expenseCat[topic] || 0) + amt
      else incomeCat[topic] = (incomeCat[topic] || 0) + amt
    })

    const allMonths = Object.keys(monthlyMap).sort()
    const last12 = allMonths.slice(-12)
    const monthlyTotals = last12.map(k => monthlyMap[k])

    const expenseByCategory = Object.entries(expenseCat).sort((a,b)=>b[1]-a[1]).map(([name,value],i)=>{
      const hue = 6 + (i * 28) % 60 // reds/oranges range
      const color = `hsl(${hue} 85% 55%)`
      return { name, value, color }
    })
    const incomeByCategory = Object.entries(incomeCat).sort((a,b)=>b[1]-a[1]).map(([name,value],i)=>{
      const hue = 140 + (i * 28) % 120 // greens/blues range
      const color = `hsl(${hue} 75% 45%)`
      return { name, value, color }
    })

    const monthlyNet = last12.map(k => {
      const m = monthlyMap[k]
      return { month: k, net: (m.income || 0) - (m.expense || 0) }
    })

    return { monthlyTotals, monthlyNet, expenseByCategory, incomeByCategory }
  }, [transactions])

  return (
    <div className="mt-8 space-y-6">
      {/* Monthly net bar chart (positive green, negative red) */}
      <div className="p-4 bg-white rounded-xl shadow-sm">
        <div className="font-medium">Monthly net (income - expense)</div>
        <div className="h-56 md:h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyNet} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
              <Bar dataKey="net">
                {monthlyNet.map((entry, idx) => (
                  <Cell key={idx} fill={entry.net >= 0 ? '#10B981' : '#EF4444'} />
                ))}
                <LabelList dataKey="net" formatter={(v)=>`₹${Number(v).toFixed(2)}`} position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly totals bar chart */}
      <div className="p-4 bg-white rounded-xl shadow-sm">
        <div className="font-medium">Monthly totals (Income vs Expense)</div>
  <div className="h-56 md:h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTotals} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" />
              <Bar dataKey="expense" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense breakdown pie */}
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <div className="font-medium">Expense breakdown by topic</div>
          <div className="h-44 md:h-56 mt-4 flex items-center justify-center">
            {expenseByCategory.length === 0 ? (
              <div className="text-slate-500">No expense data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={70} label={(entry)=>entry.name}>
                    {expenseByCategory.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Income breakdown pie */}
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <div className="font-medium">Income breakdown by topic</div>
          <div className="h-44 md:h-56 mt-4 flex items-center justify-center">
            {incomeByCategory.length === 0 ? (
              <div className="text-slate-500">No income data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={incomeByCategory} dataKey="value" nameKey="name" outerRadius={70} label={(entry)=>entry.name}>
                    {incomeByCategory.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
