
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import "../styles/DroppableArea.css";

const DroppableArea = ({ designData, onNextDesign }) => {
  const [droppedShapes, setDroppedShapes] = useState([]);
  const [activeShape, setActiveShape] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    const shape = designData.droppableAreas.find(
      (area) => area.id === active.id
    )?.shape;
    setActiveShape(shape);
  };

  const handleDragEnd = ({ over, active }) => {
    setActiveShape(null);

    if (over && over.id === "droppable") {
      const shape = designData.droppableAreas.find(
        (area) => area.id === active.id
      )?.shape;

      if (shape) {
        const newDroppedShape = {
          ...shape,
          id: active.id,
          droppedAt: over.id,
          uniqueKey: `${active.id}-${Date.now()}`, // Unique key to prevent duplicate drops
        };

        setDroppedShapes((prev) => [...prev, newDroppedShape]);
      }
    }
  };

  const evaluateAnswer = () => {
    const isCorrect = designData.droppableAreas.every((area) =>
      droppedShapes.some(
        (dropped) => dropped.id === area.id && dropped.droppedAt === "droppable"
      )
    );

    setFeedback(isCorrect ? "Correct! Well done!" : "Try Again!");

    if (isCorrect) {
      setTimeout(() => {
        onNextDesign();
      }, 1000); // Small delay to allow feedback display
    }
  };

  const resetDesign = () => {
    setDroppedShapes([]);
    setFeedback(null);
  };

  return (
    <div className="droppable-area-container">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="shapes-container">
          <h3>Draggable Shapes</h3>
          {designData.droppableAreas.map((area) => (
            <Draggable key={area.id} id={area.id} shape={area.shape} />
          ))}
        </div>

        <Droppable>
          <h3>Drop Area</h3>
          {droppedShapes.map((shape) => (
            <div
              key={shape.uniqueKey}
              dangerouslySetInnerHTML={{ __html: shape.svg }}
              className="dropped-shape"
              style={{
                position: "absolute",
                width: `${shape.dimensions.width}px`,
                height: `${shape.dimensions.height}px`,
                left: `${shape.position.x}px`,
                top: `${shape.position.y}px`,
              }}
            />
          ))}
        </Droppable>

        <DragOverlay>
          {activeShape && (
            <div
              dangerouslySetInnerHTML={{ __html: activeShape.svg }}
              style={{
                width: `${activeShape.dimensions.width}px`,
                height: `${activeShape.dimensions.height}px`,
                opacity: 0.5,
              }}
            />
          )}
        </DragOverlay>
      </DndContext>

      <div className="action-buttons">
        <button onClick={evaluateAnswer} className="evaluate-button">
          Evaluate Answer
        </button>
        <button onClick={resetDesign} className="reset-button">
          Reset Design
        </button>
      </div>

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

const Draggable = ({ id, shape }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: "grab",
    width: `${shape.dimensions.width}px`,
    height: `${shape.dimensions.height}px`,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div dangerouslySetInnerHTML={{ __html: shape.svg }} />
    </div>
  );
};

const Droppable = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "droppable" });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-area ${isOver ? "over" : ""}`}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
