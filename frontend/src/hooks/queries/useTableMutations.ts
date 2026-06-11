import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import type { CreateTableRequest, TableResponse } from "@/types/restaurant";
import type { ApiErrorResponse } from "@/types/api-error";
import { tablesApi } from "@/api/tables.api";

export function useTableMutations() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;
    const queryClient = useQueryClient();

    const invalidate = () => {
        if (restaurantId) {
            queryClient.invalidateQueries({ queryKey: ["restaurant-tables", restaurantId] });
        }
    };

    const createTable = useMutation<TableResponse, ApiErrorResponse, CreateTableRequest>({
        mutationFn: (body) => tablesApi.createTable(restaurantId, body),
        onSuccess: invalidate,
    });
    return { createTable };
}