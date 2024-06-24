import React from "react";
import { useField, useFormikContext } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = ({ name }) => {
  const { setFieldValue, values } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (value) => {
    setFieldValue(name, value);
  };

  return (
    <div>
      <ReactQuill value={values[name]} onChange={handleChange} />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default QuillEditor;
