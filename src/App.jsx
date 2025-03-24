import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import User from "./User";

const UsersList = ({ title, items, listKey }) => {
  return (
    <div className="flex justify-center items-center w-1/3">
      <div className="w-4/6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

function App() {
  const [lists, setLists] = useState({
    newList: [
      { id: "3", name: "Jessie", state: "new" },
      { id: "4", name: "Jack", state: "new" },
      { id: "5", name: "Tina", state: "new" },
      { id: "10", name: "Bob", state: "new" },
    ],
    processing: [
      { id: "1", name: "John", state: "processing" },
      { id: "2", name: "Sarah", state: "processing" },
      { id: "9", name: "Sally", state: "processing" },
    ],
    ending: [
      { id: "6", name: "Tom", state: "ending" },
      { id: "7", name: "Linda", state: "ending" },
      { id: "8", name: "Harry", state: "ending" },
    ],
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceListKey = null;
    let destinationListKey = null;

    // Encontrar las listas de origen y destino
    Object.keys(lists).forEach((key) => {
      if (lists[key].some((item) => item.id === activeId)) {
        sourceListKey = key;
      }
      if (lists[key].some((item) => item.id === overId)) {
        destinationListKey = key;
      }
    });

    if (!sourceListKey || !destinationListKey) return;

    if (sourceListKey === destinationListKey) {
      // Mover dentro de la misma lista
      const sourceList = lists[sourceListKey];
      const oldIndex = sourceList.findIndex((item) => item.id === activeId);
      const newIndex = sourceList.findIndex((item) => item.id === overId);

      const updatedList = arrayMove(sourceList, oldIndex, newIndex);

      setLists((prev) => ({
        ...prev,
        [sourceListKey]: updatedList,
      }));
    } else {
      // Mover entre listas
      const sourceList = lists[sourceListKey];
      const destinationList = lists[destinationListKey];

      const itemToMove = sourceList.find((item) => item.id === activeId);
      const newSourceList = sourceList.filter((item) => item.id !== activeId);
      const newDestinationList = [...destinationList, itemToMove];

      setLists((prev) => ({
        ...prev,
        [sourceListKey]: newSourceList,
        [destinationListKey]: newDestinationList,
      }));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <UsersList title="New List" items={lists.newList} listKey="newList" />
        <UsersList title="Processing List" items={lists.processing} listKey="processing" />
        <UsersList title="Ending List" items={lists.ending} listKey="ending" />
      </DndContext>
    </div>
  );
}

export default App;