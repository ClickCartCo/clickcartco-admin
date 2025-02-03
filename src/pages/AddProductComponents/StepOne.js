import React from "react";
import { Field } from "formik";
import QuillEditor from "../../components/QuillEditor";

const StepOne = ({ values, errors, touched, categories }) => {
  return (
    <div>
      <div className="form-group">
        <label>
          <h4>Product Title</h4>
        </label>
        <Field name="title" className="form-control" />
        {errors.title && touched.title && (
          <div className="text-danger">{errors.title}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Description</h4>
        </label>
        <QuillEditor name="description" />
        {errors.description && touched.description && (
          <div className="text-danger">{errors.description}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Price</h4>
        </label>
        <Field name="price" type="number" className="form-control" />
        {errors.price && touched.price && (
          <div className="text-danger">{errors.price}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Brand</h4>
        </label>
        <Field name="brand" className="form-control" />
        {errors.brand && touched.brand && (
          <div className="text-danger">{errors.brand}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Category</h4>
        </label>
        <Field as="select" name="category" className="form-control">
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Field>
        {errors.category && touched.category && (
          <div className="text-danger">{errors.category}</div>
        )}
      </div>
    </div>
  );
};

export default StepOne;
