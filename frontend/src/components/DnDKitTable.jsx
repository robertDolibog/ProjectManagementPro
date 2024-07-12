import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

const TableRow = ({ id, data }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {Object.values(data).map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
    </tr>
  );
};

const Table = () => {
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    axios.get("/api/data").then((response) => {
      setItems(response.data.items);
      setColumns(response.data.columns);
    });
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addCustomColumn = (name, options = []) => {
    setColumns([...columns, { name, options }]);
  };

  return (
    <div>
      <button
        onClick={() => addCustomColumn("New Column", ["Option 1", "Option 2"])}
      >
        Add Custom Column
      </button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.name}</th>
              ))}
            </tr>
          </thead>
          <SortableContext items={items} strategy={sortableKeyboardCoordinates}>
            <tbody>
              {items.map((item) => (
                <TableRow key={item.id} id={item.id} data={item} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </div>
  );
};

export default Table;
