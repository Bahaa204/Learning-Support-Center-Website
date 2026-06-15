import { fetchDepartments } from "@/services/DepartmentsService";
import { useQuery } from "@tanstack/react-query";

export function useDepartments() {
  const { data: Departments, isLoading: Loading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime:
      Infinity /* Departments never change so there is no need for it to go stale */,
  });

  return { Departments, Loading };
}
