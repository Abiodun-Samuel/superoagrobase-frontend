import Toast from "@/lib/toastify";
import { UserService } from "@/services/user.service";
import { QUERY_KEYS } from "@/utils/queries.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = (filters = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.users.list(filters),
        queryFn: () => UserService.getUsers(filters),
        staleTime: 1000 * 60 * 2, // 2 minutes
        keepPreviousData: true,
        refetchOnMount: true
    });
};

export const useUser = (userId) => {
    return useQuery({
        queryKey: QUERY_KEYS.users.detail(userId),
        queryFn: async () => {
            const { data } = await UserService.getUser(userId);
            return data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId) => UserService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
            Toast.success('User deleted successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to delete user';
            Toast.error(message);
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, status }) => UserService.updateUser(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
            Toast.success('User status updated successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to update user status';
            Toast.error(message);
        },
    });
};

export const useAssignRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }) => UserService.assignRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
            Toast.success('Role assigned successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to assign role';
            Toast.error(message);
        },
    });
};
