import { createContext } from "react";
import type { ContextDataType } from "./dataType";

export const DataContext = createContext<ContextDataType | undefined>(undefined)