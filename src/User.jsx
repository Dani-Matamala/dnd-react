import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function User({ user }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transform 
      ? 'opacity 100ms ease, box-shadow 100ms ease' 
      : 'transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease',
    boxShadow: transform ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : 'none',
    opacity: transform ? 0.9 : 1,
    position: 'relative',
    zIndex: transform ? 1 : 'auto',
    touchAction: 'none',
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-md shadow-md my-2 text-slate-950 transition-all duration-200 ease-in-out hover:shadow-lg cursor-grab active:cursor-grabbing will-change-transform"
      onTransitionEnd={(e) => {
        // Forzar repintado para asegurar que la transición se complete
        if (e.propertyName === 'transform') {
          e.target.style.willChange = 'auto';
        }
      }}
    >
      <h1>{user.name}</h1>
    </div>
  );
}

export default User;
