import React, { useState, useEffect } from 'react';
import pdfToImages from './PDFToImages';
import arrowImage from '../../assets/ImmersiveSpace/icons/next.png';

function PdfViewer({ pdf, scale = 1, position, rotation }) {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPdfImages = async () => {
      try {
        const pdfImages = await pdfToImages(pdf);
        setImages(pdfImages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdfImages();
  }, [pdf]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, images.length));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Provide default values for position and rotation if not passed
  const entityPosition = position || "0 0 0";
  const entityRotation = rotation || "0 0 0";

  return (
    <a-entity scale={`${scale} ${scale} ${scale}`} position={entityPosition} rotation={entityRotation}>
      {images.length > 0 ? (
        <>
          <a-plane
            src={images[currentPage - 1]}
            position="0 1.6 -1.5"
            rotation="0 0 0"
            width={2 * scale} // Adjust width based on scale
            height={2.7 * scale} // Adjust height based on scale
            material="shader: flat;"
          />
          <a-entity position="0 1.6 -1.5">
            <a-image 
              src={arrowImage} 
              rotation="0 180 0"  
              onClick={handlePrevPage} 
              position={`${-1.3 * scale} 0 0`} 
              scale={`${0.4 * scale} ${0.4 * scale} ${0.4 * scale}`} 
            />
            <a-image 
              src={arrowImage} 
              position={`${1.3 * scale} 0 0`} 
              onClick={handleNextPage} 
              scale={`${0.4 * scale} ${0.4 * scale} ${0.4 * scale}`} 
            />
          </a-entity>
        </>
      ) : (
        <a-text
          value="Loading images..."
          align="center"
          position="0 1.6 -3"
        />
      )}
    </a-entity>
  );
}

export default PdfViewer;

