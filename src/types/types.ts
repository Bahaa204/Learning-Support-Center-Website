import type { Dispatch, ReactNode, SetStateAction } from "react";

type UpdaterFunction<T> = Dispatch<SetStateAction<T>>;

export type Input = {
  studentName: string;
  studentId: number;
};

export type Data = Input & {
  id: string;
  added_at: string;
  added_by: string;
  nb_visits: number;
};


export type Props = {
  Data: Data[];
  setData: UpdaterFunction<Data[]>;
};

export type DataContext = Props & {
  Loading: boolean;
  setLoading: UpdaterFunction<boolean>;
  error: string | null;
  setError: UpdaterFunction<string | null>;
};

export type Children = { children: ReactNode };
