import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import User from "./User";

const UsersList = ({ title, items, setItems, otherLists, setOtherLists }) => {
  return (
    <div className="flex justify-center items-center w-1/3">
      <div className="w-4/6">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over) return;

            const activeId = active.id;
            const overId = over.id;

            // Encontrar la lista de origen
            let sourceListKey = null;
            let sourceList = null;
            let destinationListKey = null;
            let destinationList = null;

            const allLists = { ...otherLists, current: items };
            
            Object.keys(allLists).forEach((key) => {
              if (allLists[key].some((item) => item.id === activeId)) {
                sourceListKey = key;
                sourceList = allLists[key];
              }
              if (allLists[key].some((item) => item.id === overId)) {
                destinationListKey = key;
                destinationList = allLists[key];
              }
            });

            if (!sourceList || !destinationList) return;

            // Mover dentro de la misma lista
            if (sourceListKey === destinationListKey) {
              const oldIndex = sourceList.findIndex((item) => item.id === activeId);
              const newIndex = sourceList.findIndex((item) => item.id === overId);
              const updatedList = arrayMove(sourceList, oldIndex, newIndex);
              setItems(updatedList);
            } else {
              // Mover entre listas
              const itemToMove = sourceList.find((item) => item.id === activeId);
              const newSourceList = sourceList.filter((item) => item.id !== activeId);
              const newDestinationList = [...destinationList, itemToMove];

              setOtherLists((prev) => ({
                ...prev,
                [sourceListKey]: newSourceList,
                [destinationListKey]: newDestinationList,
              }));
            }
          }}
        >
          <h1 className="text-2xl font-bold">{title}</h1>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((user) => (
              <User key={user.id} user={user} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

function App() {
  const [processing, setProcessing] = useState([
    { id: 1, name: "John", state: "processing" },
    { id: 2, name: "Sarah", state: "processing" },
    { id: 9, name: "Sally", state: "processing" },
  ]);

  const [newList, setNewList] = useState([
    { id: 3, name: "Jessie", state: "new" },
    { id: 4, name: "Jack", state: "new" },
    { id: 5, name: "Tina", state: "new" },
    { id: 10, name: "Bob", state: "new" },
  ]);

  const [ending, setEnding] = useState([
    { id: 6, name: "Tom", state: "ending" },
    { id: 7, name: "Linda", state: "ending" },
    { id: 8, name: "Harry", state: "ending" },
  ]);

  return (
    <div className="flex justify-center items-center h-screen">
      <UsersList title="New List" items={newList} setItems={setNewList} otherLists={{ processing, ending }} setOtherLists={{ setProcessing, setEnding }} />
      <UsersList title="Processing List" items={processing} setItems={setProcessing} otherLists={{ newList, ending }} setOtherLists={{ setNewList, setEnding }} />
      <UsersList title="Ending List" items={ending} setItems={setEnding} otherLists={{ newList, processing }} setOtherLists={{ setNewList, setProcessing }} />
    </div>
  );
}

export default App;
