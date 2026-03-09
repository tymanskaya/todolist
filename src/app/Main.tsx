import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"

export const Main = () => {
  const [addTodolist] = useAddTodolistMutation()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Верхняя форма добавления */}
      <Grid container justifyContent="flex-start" sx={{ mb: 6 }}>
        <Box sx={{ width: '100%'}} >
          <CreateItemForm onCreateItem={addTodolist} />
        </Box>
      </Grid>

      {/* Сетка тудулистов */}
      <Grid container spacing={4} justifyContent="space-between" alignItems="stretch" sx={{ width: '100%'}}>
        <Todolists />
      </Grid>
    </Container>
  )
}
