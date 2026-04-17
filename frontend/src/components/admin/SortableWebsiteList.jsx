import {
  DndContext, closestCenter, PointerSensor,
  KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminWebsiteCard from './AdminWebsiteCard.jsx';

function SortableItem({ website, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: website._id });
  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}>
      <AdminWebsiteCard website={website} onEdit={onEdit} onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

export default function SortableWebsiteList({ websites, onReorder, onEdit, onDelete }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const oldIdx = websites.findIndex((w) => w._id === active.id);
    const newIdx = websites.findIndex((w) => w._id === over.id);
    onReorder(arrayMove(websites, oldIdx, newIdx));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={websites.map((w) => w._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {websites.map((w) => (
            <SortableItem key={w._id} website={w} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
