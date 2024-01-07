import React, { useState } from "react";

const DynamicInput = () => {
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, { id: new Date().getTime(), value: "" }]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div>
      <h2>Dynamic Fields Example</h2>
      <button className="btn btn-primary" onClick={addField}>
        Add Field
      </button>

      {fields.map((field) => (
        <div key={field.id} className="mt-3">
          <input
            type="text"
            value={field.value}
            onChange={(e) => {
              const updatedFields = fields.map((f) =>
                f.id === field.id ? { ...f, value: e.target.value } : f
              );
              setFields(updatedFields);
            }}
          />
          <button
            className="btn btn-danger ms-2"
            onClick={() => removeField(field.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default DynamicInput;
