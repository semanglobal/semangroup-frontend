export interface Data {
    name: string;
    age: number;
    isMarried: boolean
}

export interface ContextDataType {
    data: Data[];
    setData: React.Dispatch<React.SetStateAction<Data[]>>
}