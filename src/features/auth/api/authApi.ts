import { baseApi } from "@/app/baseApi.ts"
import type { BaseResponse } from "@/common/types"
import type { LoginInputs } from "@/features/auth/lib/schemas"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Расширяем LoginInputs добавлением необязательного поля captcha
    login: builder.mutation<
      BaseResponse<{ userId: number; token: string }>,
      LoginInputs & { captcha?: string | null }
    >({
      query: (body) => ({
        method: "post",
        url: "auth/login",
        body // теперь здесь будут и данные формы, и токен капчи
      }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({ method: "delete", url: "auth/login" }),
    }),
    me: builder.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi
