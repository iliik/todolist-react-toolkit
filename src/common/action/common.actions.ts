import {createAction} from "@reduxjs/toolkit";
import {TasksStateType} from "features/TodolistsList/tasks-reducer";
import {TodolistDomainType} from "features/TodolistsList/todolists-reducer";

export type ClearTasksAndTodolostsType = {
    tasks: TasksStateType
    todolists: TodolistDomainType[]
}

export const clearTasksAndTodolosts = createAction<ClearTasksAndTodolostsType>('common/clear-tasks-todolist')

