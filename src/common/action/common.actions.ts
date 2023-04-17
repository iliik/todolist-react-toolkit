import {createAction} from "@reduxjs/toolkit";


export const clearTasksAndTodolosts = createAction<number | undefined>('common/clear-tasks-todolist')

