import { setSession } from '@/lib/session';
import Toast from '@/lib/toastify';
import { AuthService } from '@/services/auth.service';
import { formatErrorMessage } from '@/utils/helper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from "next/navigation";

export const useLogin = (options = {}) => {
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (response, variables) => {
      const { data } = response;
      const { user } = data;

      await setSession(data);

      Toast.success(`Welcome back, ${user?.first_name}!`);
      options.onSuccess?.(response, variables);

      const redirectTo = options.redirectTo || "/";
      router.replace(redirectTo);
    },
    onError: (error) => {
      const message = formatErrorMessage(error);
      Toast.error(message);
    },
  });
};


