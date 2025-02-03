import React, { useState } from "react";
import {
  addProductAttr,
  addProductAttrValue,
  addSpecification,
  handleProductAttrChange,
  handleSpecificationChange,
  removeProductAttr,
  removeProductAttrValue,
  removeSpecification,
} from "./helpers/productHelpers";

const StepTwo = ({
  values,
  errors,
  touched,
  specificationName,
  setSpecificationName,
  specificationValue,
  setSpecificationValue,
  productAttrName,
  setProductAttrName,
  productAttr,
  setProductAttr,
}) => {
  return (
    <div>
      <div className="mb-5">
        <div>
          <div className="row-g-3">
            <div className="col-auto">
              <h4>Specification</h4>
            </div>
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder={`Specification Name`}
                value={specificationName}
                onChange={(e) => setSpecificationName(e.target.value)}
              />
            </div>
            <div className="col-auto mt-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addSpecification(
                    specificationName,
                    specificationValue,
                    setSpecificationName,
                    setSpecificationValue
                  )
                }
                disabled={!specificationName}
              >
                Add Field
              </button>
            </div>
          </div>
          {Object.entries(specificationValue).map(([key, value]) => (
            <div key={key} className="d-flex mt-3">
              <input
                className="form-control"
                type="text"
                placeholder={`Specification ${key.slice(13)}`}
                value={key}
                disabled
              />
              <input
                className="form-control ms-2"
                type="text"
                placeholder={`Value for Specification ${key.slice(13)}`}
                value={value}
                onChange={(e) =>
                  handleSpecificationChange(
                    key,
                    e.target.value,
                    specificationValue,
                    setSpecificationValue
                  )
                }
              />
              <button
                type="button"
                className="btn btn-danger ms-2"
                onClick={() =>
                  removeSpecification(
                    key,
                    specificationValue,
                    setSpecificationValue
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <div className="mb-5">
          <div className="row-g-3">
            <div className="col-auto">
              <h4>Add Dynamic Fields (Size, Colors, etc)</h4>
            </div>
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder={`Dynamic Fields`}
                value={productAttrName}
                onChange={(e) => setProductAttrName(e.target.value)}
              />
            </div>
            <div className="col-auto mt-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addProductAttr(
                    productAttrName,
                    productAttr,
                    setProductAttrName,
                    setProductAttr
                  )
                }
                disabled={!productAttrName}
              >
                Add Field
              </button>
            </div>
          </div>
          {Object.entries(productAttr).map(([key, values]) => (
            <div key={key} className="mt-3">
              <input
                className="form-control"
                type="text"
                placeholder={`Dynamic Field ${key.slice(13)}`}
                value={key}
                disabled
              />
              {values.map((value, index) => (
                <div key={index} className="d-flex mt-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder={`Value for Dynamic Field ${key.slice(13)}`}
                    value={value}
                    onChange={(e) =>
                      handleProductAttrChange(
                        key,
                        index,
                        e.target.value,
                        productAttr,
                        setProductAttr
                      )
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() =>
                      removeProductAttrValue(
                        key,
                        index,
                        productAttr,
                        setProductAttr
                      )
                    }
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                className="btn btn-secondary mt-2"
                type="button"
                onClick={() =>
                  addProductAttrValue(key, productAttr, setProductAttr)
                }
              >
                Add Another Value
              </button>
              <button
                className="btn btn-danger ms-2 mt-2"
                type="button"
                onClick={() =>
                  removeProductAttr(key, productAttr, setProductAttr)
                }
              >
                Remove Field
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
