import {createAction} from "@reduxjs/toolkit";


export const clearTasksAndTodolost = createAction<number | undefined>('common/clear-tasks-todolist')

