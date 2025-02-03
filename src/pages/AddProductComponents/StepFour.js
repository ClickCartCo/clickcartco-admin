import React, { useState } from "react";
import { Field, FieldArray } from "formik";

const StepFour = ({ values, errors, touched }) => {
  return (
    <div>
      <div className="form-group">
        <label>
          <h4>Thumbnail Image</h4>
        </label>
        <Field
          name="thumbnail"
          className="form-control"
          placeholder="Enter thumbnail image URL"
        />
        {errors.thumbnail && touched.thumbnail && (
          <div className="text-danger">{errors.thumbnail}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          <h4>Product Images</h4>
        </label>
        <FieldArray name="images">
          {({ push, remove }) => (
            <div>
              {values.images.map((image, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Field
                    name={`images.${index}`}
                    className="form-control"
                    placeholder="Enter image URL"
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => push("")}>
                Add Image
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      <div className="form-group">
        <label>
          <h4>Custom Ratings</h4>
        </label>
        <FieldArray name="customRatings">
          {({ push, remove }) => (
            <div>
              {values.customRatings.map((rating, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Field
                    name={`customRatings.${index}.ratingNumber`}
                    className="form-control"
                    placeholder="Rating (1-5)"
                    type="number"
                  />
                  <Field
                    name={`customRatings.${index}.percentage`}
                    className="form-control"
                    placeholder="Percentage %"
                    type="number"
                  />
                  <Field
                    name={`customRatings.${index}.noOfCustomer`}
                    className="form-control"
                    placeholder="No. of Customers"
                    type="number"
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  push({ ratingNumber: "", percentage: "", noOfCustomer: "" })
                }
              >
                Add Rating
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default StepFour;
