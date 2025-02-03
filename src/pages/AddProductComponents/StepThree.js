import React from "react";
import { Field } from "formik";

const StepThree = ({ errors, touched }) => {
  return (
    <div>
      <div className="form-group">
        <label>
          <h4>Stock Status</h4>
        </label>
        <Field as="select" name="inStock" className="form-control">
          <option value="">Select Stock Status</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </Field>
        {errors.inStock && touched.inStock && (
          <div className="text-danger">{errors.inStock}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Tags</h4>
        </label>
        <Field
          name="tags"
          className="form-control"
          placeholder="Enter product tags"
        />
        {errors.tags && touched.tags && (
          <div className="text-danger">{errors.tags}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Sale Type</h4>
        </label>
        <Field as="select" name="saleType" className="form-control">
          <option value="">Select Sale Type</option>
          <option value="regular">Regular</option>
          <option value="featured">Featured</option>
          <option value="popular">Popular</option>
        </Field>
      </div>
    </div>
  );
};

export default StepThree;
