import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";
import {appActions} from "app/app-reducer";
import {clearTasksAndTodolosts} from "common/action/common.actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {ResultCode} from "common/components/enums";


const login = createAppAsyncThunk<any, any>('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            return {status: 'succeeded'}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunk = {login}


export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
                dispatch(clearTasksAndTodolosts({tasks: {}, todolists: []}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}