import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery, useReorderTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import List from "@mui/material/List"

import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useState } from "react"
import {
  TasksPagination
} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx"
import { PAGE_SIZE } from "@/common/constants"
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskItem } from "./SortableTaskItem/SortableTaskItem"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState(1)
  const { id, filter } = todolist

  const { data, isLoading } = useGetTasksQuery({todolistId: id, params: { page }})
  const [reorderTask] = useReorderTaskMutation()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const tasks = filteredTasks || [];
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      // Вычисляем, после какого ID должна встать задача
      let putAfterItemId: string | null = null;

      if (newIndex > oldIndex) {
        // Перемещаем вниз: ставим ПОСЛЕ целевой задачи
        putAfterItemId = over.id as string;
      } else {
        // Перемещаем вверх: ставим ПОСЛЕ той, что теперь оказалась выше целевой
        const prevTask = tasks[newIndex - 1];
        putAfterItemId = prevTask ? prevTask.id : null;
      }

      reorderTask({
        todolistId: id,
        taskId: active.id as string,
        putAfterItemId,
      })
        .unwrap()
        .catch((err) => console.error("Reorder failed:", err));
    }
  };

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No tasks 😔</p>
      ) : (
        <>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={filteredTasks?.map(t => t.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {filteredTasks?.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    todolist={todolist}
                    isDraggable={filter === "all"}
                  />
                ))}
              </List>
            </SortableContext>
          </DndContext>
          {(data?.totalCount ?? 0) > PAGE_SIZE && (
            //Условие: рендерим, если общее количество больше размера страницы
            //Типизация: data?.totalCount может быть undefined, пока идет первый
            // запрос. Оператор ?? (nullish coalescing) подставляет 0, делая сравнение с числом безопасным.
            //Оператор Nullish Coalescing (??) — это идеальный инструмент в данном случае.
            // Он возвращает правое значение (0) только в том случае, если левое значение равно null или undefined.
            <TasksPagination
              totalCount={data?.totalCount || 0}
              page={page}
              setPage={setPage}
            />
          )}
        </>

      )}
    </>
  )
}


