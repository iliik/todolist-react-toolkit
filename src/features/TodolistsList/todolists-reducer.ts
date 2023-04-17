import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {appActions, RequestStatusType} from 'app/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
        name: 'todolist',
        initialState,
        reducers: {
            removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
                const index = state.findIndex(todolist => todolist.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            },
            addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
                const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
                state.unshift(newTodolist)
            },
            changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
                const todolist = state.find(todolist => todolist.id === action.payload.id)
                if (todolist) {
                    todolist.title = action.payload.title
                }
            },
            changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
                const todolist = state.find(todolist => todolist.id === action.payload.id)
                if (todolist) {
                    todolist.filter = action.payload.filter
                }
            },
            changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
                const todolist = state.find(todolist => todolist.id === action.payload.id)
                if (todolist) {
                    todolist.entityStatus = action.payload.entityStatus
                }
            },
            setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))
            },
            clearTodolists: () => {
                return []
            }
        }
    },
)

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (id: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({entityStatus: 'loading', id}))
        todolistsAPI.deleteTodolist(id)
            .then((res) => {
                dispatch(todolistsActions.removeTodolist({id}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({id, title}))
            })
    }
}

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

