
// import React, { useState, useEffect } from "react";
// import PreviewDesign from "./components/DesignPreview";
// import DroppableArea from "./components/DroppableArea";
// import { fetchDesignData } from "./utils/api";
// import "./App.css";

// const App = () => {
//   const [currentScreen, setCurrentScreen] = useState(1); // 1: Preview, 2: Drag and Drop
//   const [designData, setDesignData] = useState(null);

//   useEffect(() => {
//     const fetchDesign = async () => {
//       const design = await fetchDesignData("design1"); // Replace with dynamic ID if needed
//       setDesignData(design);
//     };

//     fetchDesign();
//   }, []);

//   if (!designData) return <div>Loading...</div>;

//   return (
//     <div className="app">
//       {currentScreen === 1 ? (
//         <PreviewDesign
//           design={designData}
//           onTimeout={() => setCurrentScreen(2)}
//         />
//       ) : (
//         <DroppableArea designData={designData} />
//       )}
//     </div>
//   );
// };

// export default App;



import React, { useState, useEffect } from "react";
import PreviewDesign from "./components/DesignPreview";
import DroppableArea from "./components/DroppableArea";
import { fetchDesignData } from "./utils/api";
import "./App.css";
const App = () => {
  const [currentScreen, setCurrentScreen] = useState(1); // 1: Preview, 2: Drag and Drop
  const [designIndex, setDesignIndex] = useState(0); // Track current design index
  const [designs, setDesigns] = useState([]); // Store all designs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDesigns = async () => {
      try {
        const designIds = ["design1", "design2","design3","design4","design5"];
        const fetchedDesigns = await Promise.all(
          designIds.map((id) => fetchDesignData(id))
        );
        setDesigns(fetchedDesigns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
    };

    fetchAllDesigns();
  }, []);

  const handleNextDesign = () => {
    if (designIndex < designs.length - 1) {
      setDesignIndex((prevIndex) => prevIndex + 1); // Increment the design index
      setCurrentScreen(1); // Reset to PreviewDesign for the next design
    } else {
      alert("All designs completed!");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      {currentScreen === 1 ? (
        <PreviewDesign
          design={designs[designIndex]}
          onTimeout={() => setCurrentScreen(2)}
        />
      ) : (
        <DroppableArea
          designData={designs[designIndex]}
          onNextDesign={handleNextDesign}
        />
      )}
    </div>
  );
};

export default App;