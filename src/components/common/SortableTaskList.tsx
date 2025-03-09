import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useState } from "react";

const initialTasks = [
  { id: "1", title: "學習 React" },
  { id: "2", title: "完成拖曳排序" },
  { id: "3", title: "優化 UI" },
];

const SortableTaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);

  // 設定感應器，讓拖曳更流暢
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 處理拖曳結束事件
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <SortableItem key={task.id} id={task.id} title={task.title} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableTaskList;
