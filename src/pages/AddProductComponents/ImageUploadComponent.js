import axios from "axios";
import React, { useRef, useState } from "react";

const ImageUploadComponent = ({
  allowMultipleUploads = false,
  setFieldValue,
  fieldName,
  imageLinks = [],
}) => {
  const [imageData, setImageData] = useState(imageLinks);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setUploadingImage(true);
    setFileName(
      files.length === 1 ? files[0].name : `${files.length} files selected`
    );

    const uploadedImages = [...imageData];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", process.env.REACT_APP_CLOUD_PRESET);
      formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
          formData
        );

        uploadedImages.push(response.data.secure_url);
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
      }
    }

    setUploadingImage(false);
    setFileName("No file chosen");
    setImageData(uploadedImages);
    if (allowMultipleUploads) {
      setFieldValue(fieldName, uploadedImages);
    } else {
      setFieldValue(fieldName, uploadedImages[0]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imageData.filter((_, i) => i !== index);
    setImageData(updatedImages);
    if (allowMultipleUploads) {
      setFieldValue(fieldName, updatedImages);
    } else {
      setFieldValue(fieldName, "");
    }
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label fw-bold">Upload Image</label>
        <div className="input-group">
          <button
            type="button"
            className="btn btn-primary"
            disabled={uploadingImage}
            onClick={handleClick}
          >
            Choose File
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            multiple={allowMultipleUploads}
            className="d-none"
            onChange={handleImageUpload}
          />
          <span className="form-control">{fileName}</span>
        </div>
      </div>

      {imageData.length > 0 && (
        <div className="d-flex mt-4">
          {imageData.map((img, index) => (
            <div className="position-relative mx-2" key={index}>
              <button
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => handleRemoveImage(index)}
              >
                &times;
              </button>
              <img
                className="rounded shadow"
                src={img}
                alt={`Uploaded ${index + 1}`}
                style={{ width: "96px", height: "96px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageUploadComponent;
