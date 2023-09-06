import { PrimaryButton, Stack } from "@fluentui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
type Props = {
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  selectedImages: File[];
};

function ImagePicker({ setSelectedImages, selectedImages }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple file selection
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
  });

  const removeImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const renderSelectedImages = () => {
    return (
      <Stack
        horizontal
        wrap
        tokens={{ childrenGap: 10 }}
        horizontalAlign="center"
        style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "hidden" }}
      >
        {selectedImages.map((image, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              src={URL.createObjectURL(image)}
              alt={`Selected Image ${index}`}
              height="150px"
            />
            <button
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "white",
                border: "none",
                color: "red",
              }}
              onClick={() => removeImage(index)}
            >
              X
            </button>
          </div>
        ))}
      </Stack>
    );
  };

  return (
    <>
      {renderSelectedImages()}
      <Stack
        {...getRootProps()}
        className="dropzone"
        style={{
          height: "100px",
          backgroundColor: "lightgray",
          border: "1px dashed black",
          cursor: "pointer",
        }}
        horizontalAlign="center"
        verticalAlign="center"
      >
        <input {...getInputProps()} />
        <p>Drag &amp; drop some images here, or click to select images.</p>
      </Stack>
    </>
  );
}

export default ImagePicker;
