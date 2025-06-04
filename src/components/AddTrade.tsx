import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useUsers } from "../hooks/useUsers";

export const AddTrade = ({ setAddTrade }: { setAddTrade: Dispatch<SetStateAction<boolean>>}) => {
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
      console.log(trades);
      toast.success("Trade added successfully");
      setAddTrade(false); // Close the modal or reset the form
    } catch (error) {
      console.log(error);
      toast.error("Error adding trade");
    }
  };

  return (
    <div className="p-6 mt-8 border rounded-lg shadow-lg card-glow border-emerald-600/30">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium text-white">Add Trade</h3>
      </div>
      <form onSubmit={addTrades} >
        <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
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
          <label className="text-sm text-white">Date</label>
          <input
            type="date"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                date: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Time</label>
          <input
            type="time"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                time: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Pair</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                pair: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Type</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                type: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Entry</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                entry: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Exit</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                exit: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">P & L</label>
          <input
            type="text"
            onChange={(e) =>
              setTradeState({
                ...tradeState,
                pl: e.target.value,
              })
            }
            className="p-2 text-white bg-transparent border border-yellow-400 rounded-md focus:ring-0 focus:outline-none "
          />
        </div>
        </div>
        <button
        type="submit" 
        className="px-4 py-2 mt-4 text-white transition-colors duration-300 border border-yellow-500 rounded-md bg-emerald-700 hover:bg-emerald-600"
        >Save</button>
      </form>
    </div>
  )
}
