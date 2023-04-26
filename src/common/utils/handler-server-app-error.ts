import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {appActions} from "app/app-reducer";
import {ResponseTypes} from "common/types";

export const handleServerAppError = <D>(data: ResponseTypes<D>, dispatch: Dispatch, showError: boolean = true) => {

    if (data.messages.length) {

        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}