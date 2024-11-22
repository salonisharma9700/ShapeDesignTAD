

// import React, { useEffect } from "react";
// import "../styles/PreviewDesign.css";

// const PreviewDesign = ({ design, onTimeout }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onTimeout();
//     }, 5000); // Show for 5 seconds

//     return () => clearTimeout(timer);
//   }, [onTimeout]);

//   return (
//     <div className="preview-design">
//       <h2 className="preview-title">Target Design</h2>
//       <div className="preview-container">
//         {design.droppableAreas.map((area, index) => (
//           <div
//             key={index}
//             dangerouslySetInnerHTML={{ __html: area.shape.svg }}
//             style={{
//               position: "absolute",
//               left: `${area.shape.position?.x || 0}px`,
//               top: `${area.shape.position?.y || 0}px`,
//               width: `${area.shape.dimensions?.width}px`,
//               height: `${area.shape.dimensions?.height}px`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PreviewDesign;

import React, { useEffect } from "react";
import "../styles/PreviewDesign.css";

const PreviewDesign = ({ design, onTimeout }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 5000); // Show for 5 seconds

    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <div className="preview-design text-center d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="preview-title mb-4">Target Design</h2>
      <div className="preview-container position-relative">
        {design.droppableAreas.map((area, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: area.shape.svg }}
            style={{
              position: "absolute",
              left: `${area.shape.position?.x || 0}px`,
              top: `${area.shape.position?.y || 0}px`,
              width: `${area.shape.dimensions?.width}px`,
              height: `${area.shape.dimensions?.height}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewDesign;
