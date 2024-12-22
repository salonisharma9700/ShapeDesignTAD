import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material";

const ShapeSelectionScreen = ({ onDesignSelection }) => {
  const [shapesData, setShapesData] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/shapesData.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shapes data");
        }
        return response.json();
      })
      .then((data) => {
        setShapesData(data.designs);
      })
      .catch((error) => {
        console.error("Error fetching shapes data:", error);
      });
  }, []);

  const handleShapeSelect = (designId, shapeId) => {
    setSelectedShapes((prev) => {
      const newSelection = [...prev];
      const selectionExists = newSelection.some(
        (selection) => selection.designId === designId && selection.shapeId === shapeId
      );
      if (selectionExists) {
        return newSelection.filter(
          (selection) => !(selection.designId === designId && selection.shapeId === shapeId)
        );
      } else {
        newSelection.push({ designId, shapeId });
        return newSelection;
      }
    });
  };

  const handleSendToPreview = () => {
    const randomizedShapes = selectedShapes.map(({ designId, shapeId }) => {
      const design = shapesData.find((d) => d.id === designId);
      const shape = design.droppableAreas.find((area) => area.id === shapeId);

      return { ...design, selectedShape: shape };
    }).sort(() => Math.random() - 0.5);

    onDesignSelection(randomizedShapes);
    console.log(randomizedShapes);
    navigate("/preview");
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        {shapesData.map((design) => (
          <div
            key={design.id}
            style={{
              border: selectedShapes.some(
                (selection) => selection.designId === design.id
              )
                ? "2px solid green"
                : "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "white",
              width: "300px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            {selectedShapes.some(
              (selection) => selection.designId === design.id
            ) && (
              <CheckCircle
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  color: "green",
                  fontSize: "24px",
                }}
              />
            )}
            <h3 style={{ textAlign: "center" }}>{design.id}</h3>
            <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
              {design.droppableAreas?.map((area) => (
                <div
                  key={area.id}
                  style={{
                    position: "absolute",
                    top: `${area.shape.position.y}px`,
                    left: `${area.shape.position.x}px`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleShapeSelect(design.id, area.id)}
                  dangerouslySetInnerHTML={{ __html: area.shape.svg }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleSendToPreview}
          style={{
            padding: "12px 25px",
            background: "linear-gradient(to right, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#45a049";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "linear-gradient(to right, #4CAF50, #45a049)";
            e.target.style.transform = "scale(1)";
          }}
        >
          Start Game with Selected Designs
        </button>
      </div>
    </div>
  );
};

export default ShapeSelectionScreen;
