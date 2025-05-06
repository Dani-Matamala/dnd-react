import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import User from "./User";
import { useDroppable } from "@dnd-kit/core";

const UsersList = ({ title, items, listKey }) => {
  return (
    <div className="flex justify-center items-start w-1/3 min-h-[500px]">
      <div className="w-4/6 bg-slate-800 p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-white">{title}</h1>
        <div className="space-y-2">
          {items.length === 0 ? (
            <EmptyDropZone listKey={listKey} />
          ) : (
            items.map((user) => (
              <User key={user.id} user={user} />
            ))
          )}
        </div>
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
    let overId = over.id;

    // Si el elemento se suelta sobre sí mismo, no hacer nada
    if (activeId === overId) return;

    let sourceListKey = null;
    let destinationListKey = null;

    // Si el drop es sobre una columna vacía, extraer el key correcto
    if (overId.startsWith('empty-')) {
      destinationListKey = overId.replace('empty-', '');
    }

    // Encontrar las listas de origen y destino
    Object.keys(lists).forEach((key) => {
      if (lists[key].some((item) => item.id === activeId)) {
        sourceListKey = key;
      }
      // Solo buscar destination si no es columna vacía
      if (!destinationListKey && lists[key].some((item) => item.id === overId)) {
        destinationListKey = key;
      }
    });

    if (!sourceListKey || !destinationListKey) return;

    // Usar un pequeño retraso para permitir que la animación se complete
    setTimeout(() => {
      if (sourceListKey === destinationListKey) {
        // Mover dentro de la misma lista
        const sourceList = lists[sourceListKey];
        const oldIndex = sourceList.findIndex((item) => item.id === activeId);
        const newIndex = sourceList.findIndex((item) => item.id === overId);

        if (oldIndex !== newIndex) {
          const updatedList = arrayMove(sourceList, oldIndex, newIndex);
          setLists((prev) => ({
            ...prev,
            [sourceListKey]: updatedList,
          }));
        }
      } else {
        // Mover entre listas
        const sourceList = lists[sourceListKey];
        const destinationList = lists[destinationListKey];

        const itemToMove = sourceList.find((item) => item.id === activeId);
        
        // Verificar si el elemento ya está en la lista de destino
        if (!destinationList.some(item => item.id === activeId)) {
          const newSourceList = sourceList.filter((item) => item.id !== activeId);
          const newDestinationList = [...destinationList, itemToMove];

          setLists((prev) => ({
            ...prev,
            [sourceListKey]: newSourceList,
            [destinationListKey]: newDestinationList,
          }));
        }
        // Caso especial: columna vacía (destinationList estaba vacío)
        if (destinationList.length === 0) {
          const newSourceList = sourceList.filter((item) => item.id !== activeId);
          const newDestinationList = [itemToMove];
          setLists((prev) => ({
            ...prev,
            [sourceListKey]: newSourceList,
            [destinationListKey]: newDestinationList,
          }));
        }
      }
    }, 10); // Pequeño retraso para permitir que la animación se complete
  };

  // Unificar todos los ids de usuarios para el SortableContext global
  const allUserIds = [
    ...lists.newList.map(u => u.id),
    ...lists.processing.map(u => u.id),
    ...lists.ending.map(u => u.id),
  ];

  return (
    <div className="h-screen bg-slate-900 p-8">
      <div className="flex justify-center items-start gap-8 h-full">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          autoScroll={{
            enabled: true,
            acceleration: 15,
          }}
        >
          <SortableContext items={allUserIds} strategy={verticalListSortingStrategy}>
            <UsersList title="New List" items={lists.newList} listKey="newList" />
            <UsersList title="Processing List" items={lists.processing} listKey="processing" />
            <UsersList title="Ending List" items={lists.ending} listKey="ending" />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// Componente auxiliar para permitir drop en listas vacías
function EmptyDropZone({ listKey }) {
  const { setNodeRef, isOver } = useDroppable({ id: `empty-${listKey}` });
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 0,
        height: 72,
        margin: '8px 0',
        border: isOver ? '2px solid #38bdf8' : '2px dashed #64748b',
        borderRadius: 8,
        background: isOver ? '#e0f2fe' : '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: 18,
        fontStyle: 'italic',
        opacity: isOver ? 0.7 : 1,
        boxShadow: isOver ? '0 10px 15px -3px rgba(56,189,248,0.2)' : 'none',
        transition: 'all 0.2s',
      }}
      className="p-4 rounded-md shadow-md transition-all duration-200 ease-in-out"
    >
      <span>{isOver ? 'Suelta para agregar' : 'Arrastra aquí'}</span>
    </div>
  );
}

export default App;