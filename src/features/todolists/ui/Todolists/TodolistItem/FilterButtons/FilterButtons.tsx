import { useAppDispatch } from "@/common/hooks"
import styles from './FilterButtons.module.css'
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist, FilterValues } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.filter = filter
        }
      }),
    )
  }

  return (
    <Box className={styles.filterContainer}>
      <Button
        className={`${styles.filterBtn} ${filter === "all" ? styles.activeBtn : ""}`}
        onClick={() => changeFilter("all")}
      >
        All
      </Button>

      <Button
        className={`${styles.filterBtn} ${filter === "active" ? styles.activeBtn : ""}`}
        onClick={() => changeFilter("active")}
      >
        Active
      </Button>

      <Button
        className={`${styles.filterBtn} ${filter === "completed" ? styles.activeBtn : ""}`}
        onClick={() => changeFilter("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}