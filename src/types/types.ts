export type Input = {
  studentName: string;
  studentId: number;
};

export type Data = Input & {
  id: string;
  created_at: string;
  added_by: string;
};

