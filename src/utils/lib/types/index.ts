import { ColumnDef } from "@tanstack/react-table";

export interface ProductType {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  id: number;
}
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
