import { useQueryClient } from "react-query";

export const useGetFetchQuery =(name: string) => {
    const queryClient =  useQueryClient();

    return queryClient.getQueryData(name);
};