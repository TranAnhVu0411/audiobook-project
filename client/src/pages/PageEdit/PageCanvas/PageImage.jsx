import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const PageImage = ({
  imageUrl,
  setCanvasMeasures,
  setOriginalMeasures,
  onMouseDown,
  onMouseUp,
  onMouseMove
}) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const imageToLoad = new window.Image();
    imageToLoad.src = imageUrl;
    imageToLoad.addEventListener("load", () => {
      setImage(imageToLoad);
      setCanvasMeasures({
        width: imageToLoad.width,
        height: imageToLoad.height
      });
      setOriginalMeasures({
        width: imageToLoad.width,
        height: imageToLoad.height
      });
    });

    return () => imageToLoad.removeEventListener("load", null);
  }, [imageUrl, setImage, setCanvasMeasures]);

  return (
    <Image
      image={image}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};

export default PageImage;