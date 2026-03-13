import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx"


export const SortableTaskItem = (props: any) => {
  const { task, isDraggable } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    disabled: !isDraggable // Отключаем dnd, если фильтр не "all"
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    touchAction: 'none', // Важно для мобильных устройств
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem {...props} />
    </div>
  );
};
