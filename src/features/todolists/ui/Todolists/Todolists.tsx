import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Grid } from "@mui/material";
import { useGetTodolistsQuery, useReorderTodolistMutation } from "../../api/todolistsApi";

import Box from "@mui/material/Box"
import { containerSx } from "@/common/styles/container.styles.ts"
import { TodolistSkeleton } from "@/features/todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton.tsx"
import { SortableTodolist } from "@/features/todolists/ui/Todolists/SortableTodolist/SortableTodolist.tsx"

const Todolists = () => {
  const { data: todolists, isLoading } = useGetTodolistsQuery();
  const [reorderTodolist] = useReorderTodolistMutation(); // Твой мутейшн для API

  // Настройка сенсоров (чтобы клики по кнопкам внутри карточки не считались началом драга)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && todolists) {
      const oldIndex = todolists.findIndex(t => t.id === active.id);
      const newIndex = todolists.findIndex(t => t.id === over.id);

      // Вычисляем соседа для API согласно твоей документации
      // Если ставим на 0 место — null, иначе — id того, кто ТЕПЕРЬ стоит перед нами
      const newOrder = arrayMove(todolists, oldIndex, newIndex);
      const putAfterItemId = newIndex === 0 ? null : newOrder[newIndex - 1].id;

      reorderTodolist({
        todolistId: active.id as string,
        putAfterItemId
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todolists || []} strategy={rectSortingStrategy}>
        <Grid container spacing={4} justifyContent="flex-start">
          {todolists?.map((todolist) => (
            <SortableTodolist key={todolist.id} todolist={todolist} />
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
};
export default Todolists

