import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useUsers } from '../hooks/useUsers';

interface PortfolioValue {
  total_value: number
  pnl: number
  pnl_percentage: number
}

export function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [portfolioValues, setPortfolioValues] = useState<PortfolioValue>({
    total_value: 0,
    pnl: 0,
    pnl_percentage: 0,
  })
  const [loading, setLoading] = useState(false)

  const { users } = useUsers()
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio_values')
        .upsert({
          user_id: selectedUser,
          ...portfolioValues,
          updated_at: new Date().toISOString(),
        }, 
        {
          onConflict: 'user_id' // specify the column(s) that should be unique
        }
      );

      if (error) throw error;
      toast.success('Portfolio values updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error updating portfolio values');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = async (value: string) => {
    setSelectedUser(value)
    const { data } = await supabase
        .from('portfolio_values')
        .select('*')
        .eq('user_id', value)
        .single()

       setPortfolioValues(
        {
          total_value: data.total_value,
          pnl: data.pnl,
          pnl_percentage: data.pnl_percentage
        }
       )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-emerald-800 mb-6">Update User Portfolio</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-emerald-700">
            Select User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-emerald-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700">
            Total Value
          </label>
          <input
            type="number"
            step="0.01"
            value={portfolioValues.total_value}
            onChange={(e) => setPortfolioValues({
              ...portfolioValues,
              total_value: parseFloat(e.target.value),
            })}
            className="mt-1 block w-full border border-emerald-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700">
            P&L
          </label>
          <input
            type="number"
            step="0.01"
            value={portfolioValues.pnl}
            onChange={(e) => setPortfolioValues({
              ...portfolioValues,
              pnl: parseFloat(e.target.value),
            })}
            className="mt-1 block w-full border border-emerald-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700">
            P&L Percentage
          </label>
          <input
            type="number"
            step="0.01"
            value={portfolioValues.pnl_percentage}
            onChange={(e) => setPortfolioValues({
              ...portfolioValues,
              pnl_percentage: parseFloat(e.target.value),
            })}
            className="mt-1 block w-full border border-emerald-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {loading ? 'Updating...' : 'Update Portfolio Values'}
          </button>
        </div>
      </form>
    </div>
  );
}