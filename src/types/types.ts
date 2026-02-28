import type { Dispatch, SetStateAction } from "react";

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

export type InputFormProps = {
  Data: Data[],
  setData: Dispatch<SetStateAction<Data[]>>;
};

export type TableProps = {
  Data: Data[];
  setData: Dispatch<SetStateAction<Data[]>>;
};
