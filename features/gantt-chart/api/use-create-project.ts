import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useToast } from "@/hooks/useToast";

type ResponseType = InferResponseType<(typeof client.api.project)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.project)["$post"]>;

export const useCreateProject = () => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, unknown, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.project["$post"]({ json });
            if (!response.ok) {
                throw new Error("Failed to create project");
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            showToast("Success", "Project created successfully.", "success");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (error) => {
            showToast("Error", error instanceof Error ? error.message : "An error occurred", "error");
        }
    });
    return mutation;
}