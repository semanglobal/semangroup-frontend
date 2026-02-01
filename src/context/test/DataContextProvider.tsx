import { DataContext } from "./dataContext";
import { useState, type ReactNode } from "react";
import { type Data } from "./dataType";

const DataContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [data, setData] = useState<Data[]>([])
    return (
        <DataContext.Provider value={{data, setData}}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider