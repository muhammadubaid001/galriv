import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const useUsers = () => {
    const [users, setUsers] = useState<{id: string, email: string}[]>([])
    useEffect(() => {
        fetchUsers()
      }, [])
    
      const fetchUsers = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('is_admin', false);
          
          if (error) throw error;
          setUsers(data || []);
        } catch (error) {
          console.log("User", error)
          toast.error('Error fetching users', );
        }
      };
    
    return  {
        users,
        setUsers
    }
}