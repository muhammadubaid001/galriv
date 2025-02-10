import { SyntheticEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useUsers } from "../hooks/useUsers";

export const AddTrade = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [tradeState, setTradeState] = useState({
    date: "",
    time: "",
    pair: "",
    type: "",
    entry: "",
    exit: "",
    pl: "",
  })

  const { users } = useUsers();

  const addTrades = async (e: SyntheticEvent) => {
    e.preventDefault()

    try {
      const { data: trades, error } = await supabase.from("trades").insert({
        user_id: selectedUser, // This links to auth.users
        ...tradeState,
      });

      if (error) throw error;

      toast.success("Trade added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error adding trade");
    }
  };

  return (
    <div className="card-glow p-6 rounded-lg mt-8 shadow-lg border border-emerald-600/30">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium text-white">Add Trade</h3>
      </div>
      <form onSubmit={addTrades} >
        <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Date</label>
          <input
            type="date"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                date: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Time</label>
          <input
            type="time"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                time: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Pair</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                pair: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Type</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                type: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Entry</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                entry: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Exit</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                exit: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">P & L</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                pl: e.target.value,
              })
            }
            className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
          />
        </div>
        </div>
        <button
        type="submit" 
        className="mt-4 border border-yellow-500 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300"
        >Save</button>
      </form>
    </div>
  )
}
