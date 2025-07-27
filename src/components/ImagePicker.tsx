import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Colors } from "./constants";
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
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2
        }}
      >
        {selectedImages.map((image, index) => (
          <Paper 
            key={index} 
            elevation={2}
            sx={{ 
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`Selected Image ${index}`}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <IconButton
              size="small"
              onClick={() => removeImage(index)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        border: `2px dashed ${Colors.blue}`,
        borderRadius: 3,
        backgroundColor: 'rgba(25, 118, 210, 0.02)'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2, 
          color: Colors.blue, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <PhotoCameraIcon />
        Property Images {selectedImages.length > 0 && `(${selectedImages.length})`}
      </Typography>
      
      {selectedImages.length > 0 && renderSelectedImages()}
      
      <Box
        {...getRootProps()}
        sx={{
          minHeight: 80,
          border: `1px dashed ${Colors.blue}`,
          borderRadius: 2,
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderColor: Colors.raspberry
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ color: Colors.blue }} />
        <Typography color={Colors.blue} fontWeight={500}>
          {selectedImages.length === 0 ? 'Add Images' : 'Add More Images'}
        </Typography>
      </Box>
      
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ mt: 1, display: 'block', textAlign: 'center' }}
      >
        JPG, PNG up to 10MB each • Drag & drop or click to browse
      </Typography>
    </Paper>
  );
}

export default ImagePicker;
