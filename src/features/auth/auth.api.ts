import {instance} from "common/api/common-api";
import {ResponseTypes} from "common/types";


export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseTypes<{ userId?: number }>>('auth/login', data);
    },
    logout() {
        return instance.delete<ResponseTypes<{ userId?: number }>>('auth/login');
    },
    me() {
        return instance.get<ResponseTypes<{ id: number; email: string; login: string }>>('auth/me')
    }
}


export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
