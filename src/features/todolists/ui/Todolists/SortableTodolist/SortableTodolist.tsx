import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grid, Paper } from "@mui/material"
import { TodolistItem } from "../TodolistItem/TodolistItem"

export const SortableTodolist = ({ todolist }: { todolist: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todolist.id });

  const style = {
    transform: CSS.Translate.toString(transform), // Используем Translate для сеток
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <Grid ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper elevation={3} sx={{
        p: 3,
        borderRadius: '16px',
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'grab', // Добавляем курсор руки
        '&:hover': { transform: 'translateY(-4px)', transition: '0.2s' }
      }}>
        <TodolistItem todolist={todolist} />
      </Paper>
    </Grid>
  );
};
