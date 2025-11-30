import { AuthContext } from "@/components/provider/AuthProvider";
import { useContext } from "react";

const useAuth = () => useContext(AuthContext);
export default useAuth