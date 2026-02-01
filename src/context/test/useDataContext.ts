import { useContext } from "react";
import { DataContext } from "./dataContext";

export const useDataContext = () => {
    const context = useContext(DataContext)
    return context
}