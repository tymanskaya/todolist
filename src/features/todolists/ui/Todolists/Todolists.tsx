import { containerSx } from "@/common/styles"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import Box from "@mui/material/Box"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"

export const Todolists = () => {
  const { data: todolists, isLoading } = useGetTodolistsQuery()

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <>
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    transition: 'transform 0.2s',
                    width: '320px',           // Фиксированная ширина
                        // Фиксированная высота (подберите под себя)
                    display: 'flex',          // Включаем flexbox
                    flexDirection: 'column',


                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
