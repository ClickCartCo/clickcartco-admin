import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import QuillEditor from "../components/QuillEditor";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  resetState,
  updateProductDetails,
} from "../features/product/productSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import ImageUploadComponent from "./AddProductComponents/ImageUploadComponent";

const UpdateProduct = () => {
  const [productAttrName, setProductAttrName] = useState("");
  const [specificationName, setSpecificationName] = useState("");
  const [isEditing, setIsEditing] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/")[3];
  const catState = useSelector((state) => state.pCategory.pCategories);
  const {
    productDetails,
    updatedProduct,
    isLoading: fetchingProduct,
    updatingProduct,
    isSuccess,
    isError,
  } = useSelector((state) => state.product);
  const initialProductDetails = {
    ...productDetails,
    customRatings: productDetails?.customRatings || [],
    productAttributes: productDetails?.productAttributes || {},
  };

  useEffect(() => {
    if (productId !== undefined) {
      dispatch(getProductDetails(productId));
      dispatch(getCategories());
    } else {
      dispatch(resetState());
    }
  }, [productId]);

  useEffect(() => {
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfullly!");
      navigate("/admin/list-product");
      dispatch(resetState());
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, fetchingProduct, updatingProduct]);

  const handleEditClick = (step, setFieldValue) => {
    if (isEditing[step]) {
      // Reset only the fields related to that step
      switch (step) {
        case "step1":
          setFieldValue("title", initialProductDetails.title);
          setFieldValue("description", initialProductDetails.description);
          setFieldValue("price", initialProductDetails.price);
          setFieldValue("brand", initialProductDetails.brand);
          setFieldValue("category", initialProductDetails.category);
          break;

        case "step2":
          setFieldValue("specifications", initialProductDetails.specifications);
          setFieldValue(
            "productAttributes",
            initialProductDetails.productAttributes
          );
          break;

        case "step3":
          setFieldValue("inStock", initialProductDetails.inStock);
          setFieldValue("tags", initialProductDetails.tags);
          break;

        case "step4":
          setFieldValue("thumbnail", initialProductDetails.thumbnail);
          setFieldValue("images", initialProductDetails.images);
          setFieldValue("customRatings", initialProductDetails.customRatings);
          break;

        default:
          break;
      }
    }
    setIsEditing((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const handleSubmit = (e, values) => {
    // Prevent default behavior if it's an event
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const updatedProductInfo = structuredClone(values);
    delete updatedProductInfo._id;
    delete updatedProductInfo.__v;
    const payload = { productId, updatedProductInfo };
    dispatch(updateProductDetails(payload));
  };

  const stepTwo = (values, errors, touched, setFieldValue) => {
    const addSpecification = () => {
      if (specificationName) {
        setFieldValue(`specifications.${specificationName}`, "");
        setSpecificationName("");
      }
    };

    const handleSpecificationChange = (key, value) => {
      setFieldValue(`specifications.${key}`, value);
    };

    const removeSpecification = (key) => {
      const { [key]: _, ...rest } = values.specifications;
      setFieldValue("specifications", rest);
    };

    const addProductAttr = () => {
      if (productAttrName) {
        setFieldValue(`productAttributes.${productAttrName}`, []);
        setProductAttrName("");
      }
    };

    const handleProductAttrChange = (key, index, value) => {
      const newValues = [...values.productAttributes[key]];
      newValues[index] = value;
      setFieldValue(`productAttributes.${key}`, newValues);
    };

    const addProductAttrValue = (key) => {
      setFieldValue(`productAttributes.${key}`, [
        ...values.productAttributes[key],
        "",
      ]);
    };

    const removeProductAttrValue = (key, index) => {
      const newValues = values.productAttributes[key].filter(
        (_, i) => i !== index
      );
      setFieldValue(`productAttributes.${key}`, newValues);
    };

    const removeProductAttr = (key) => {
      const { [key]: _, ...rest } = values.productAttributes;
      setFieldValue("productAttributes", rest);
    };

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
                  placeholder="Specification Name"
                  value={specificationName}
                  onChange={(e) => setSpecificationName(e.target.value)}
                />
              </div>
              <div className="col-auto mt-2">
                <button
                  className="btn btn-primary"
                  onClick={addSpecification}
                  disabled={!specificationName}
                >
                  Add Field
                </button>
              </div>
            </div>
            {values.specifications &&
              Object.entries(values.specifications)?.map(([key, value]) => (
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
                      handleSpecificationChange(key, e.target.value)
                    }
                  />
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => removeSpecification(key)}
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
                <h4>Product Attributes (Size, Colors, etc)</h4>
              </div>
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dynamic Fields"
                  value={productAttrName}
                  onChange={(e) => setProductAttrName(e.target.value)}
                />
              </div>
              <div className="col-auto mt-2">
                <button
                  className="btn btn-primary"
                  onClick={addProductAttr}
                  disabled={!productAttrName}
                >
                  Add Field
                </button>
              </div>
            </div>
            {values.productAttributes &&
              Object.entries(values.productAttributes)?.map(([key, values]) => (
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
                          handleProductAttrChange(key, index, e.target.value)
                        }
                      />
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => removeProductAttrValue(key, index)}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => addProductAttrValue(key)}
                  >
                    Add Another Value
                  </button>
                  <button
                    className="btn btn-danger ms-2 mt-2"
                    onClick={() => removeProductAttr(key)}
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

  if (fetchingProduct) return null;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Update Product</h1>
      <Formik
        initialValues={initialProductDetails}
        // validationSchema={validationSchema}
      >
        {({ values, errors, touched, setFieldValue }) => {
          const isChanged = !isEqual(values, initialProductDetails);
          return (
            <Form>
              {/* Step 1 Card */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2>Step 1: Basic Information</h2>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleEditClick("step1", setFieldValue)}
                  >
                    {isEditing.step1 ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="card-body">
                  {isEditing.step1 ? (
                    <>
                      <div className="form-group">
                        <label>Product Title</label>
                        <Field name="title" className="form-control" />
                        {errors.title && touched.title && (
                          <div className="text-danger">{errors.title}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <QuillEditor name="description" />
                      </div>
                      <div className="form-group">
                        <label>Price</label>
                        <Field
                          name="price"
                          type="number"
                          className="form-control"
                        />
                        {errors.price && touched.price && (
                          <div className="text-danger">{errors.price}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Brand</label>
                        <Field name="brand" className="form-control" />
                        {errors.brand && touched.brand && (
                          <div className="text-danger">{errors.brand}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        {/* <Field name="category" className="form-control" /> */}
                        <Field
                          as="select"
                          name="category"
                          className="form-control"
                        >
                          {catState.map((category, index) => {
                            return (
                              <option
                                key={index}
                                value={category._id}
                                label={category.name}
                              />
                            );
                          })}
                        </Field>
                        {errors.category && touched.category && (
                          <div className="text-danger">{errors.category}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="fs-5">
                        <strong>Title:</strong> {values.title}
                      </p>
                      <p className="fs-5">
                        <strong>Description:</strong>{" "}
                        {typeof values.description === "string"
                          ? values.description
                          : JSON.stringify(values.description)}
                      </p>
                      <p className="fs-5">
                        <strong>Price:</strong> ${values.price}
                      </p>
                      <p className="fs-5">
                        <strong>Brand:</strong> {values.brand}
                      </p>
                      <p className="fs-5">
                        <strong>Category:</strong>{" "}
                        {
                          catState.find(
                            (category) => category._id === values.category
                          )?.name
                        }
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Step 2 Card */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2>Step 2: Specifications and Product Attributes</h2>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleEditClick("step2", setFieldValue)}
                  >
                    {isEditing.step2 ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="card-body">
                  {isEditing.step2 ? (
                    stepTwo(values, errors, touched, setFieldValue)
                  ) : (
                    <>
                      <h4>Specifications</h4>
                      {values.specifications &&
                        Object.entries(values.specifications)?.map(
                          ([key, value], index) => (
                            <p key={index} className="fs-6">
                              <strong>{key}:</strong> {value}
                            </p>
                          )
                        )}
                      <h4>Product Attributes</h4>
                      {values?.productAttributes &&
                        Object.entries(values?.productAttributes)?.map(
                          ([key, values], index) => (
                            <div key={index} className="mb-2">
                              <p className="fs-6">
                                <strong>{`${key}: `}</strong>
                                {values.join(",")}
                              </p>
                            </div>
                          )
                        )}
                    </>
                  )}
                </div>
              </div>

              {/* Step 3 Card */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2>Step 3: Stock and Sale Type</h2>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleEditClick("step3", setFieldValue)}
                  >
                    {isEditing.step3 ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="card-body">
                  {isEditing.step3 ? (
                    <>
                      <div className="form-group">
                        <label>In Stock</label>
                        <Field
                          name="inStock"
                          as="select"
                          className="form-control"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </Field>
                        {errors.inStock && touched.inStock && (
                          <div className="text-danger">{errors.inStock}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Sale Type</label>
                        <Field name="tags" as="select" className="form-control">
                          <option value="Regular">Regular</option>
                          <option value="Featured">Featured</option>
                          <option value="Popular">Popular</option>
                        </Field>
                        {errors.tags && touched.tags && (
                          <div className="text-danger">{errors.tags}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="fs-5">
                        <strong>In Stock:</strong>{" "}
                        {values.inStock ? "Yes" : "No"}
                      </p>
                      <p className="fs-5">
                        <strong>Sale Type:</strong> {values.tags}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Step 4 Card */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2>Step 4: Images and Reviews</h2>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleEditClick("step4", setFieldValue)}
                  >
                    {isEditing.step4 ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="card-body">
                  {isEditing.step4 ? (
                    <>
                      <div className="form-group">
                        <h4>Thumbnail</h4>
                        <ImageUploadComponent
                          setFieldValue={setFieldValue}
                          fieldName="thumbnail"
                          imageLinks={[values.thumbnail]}
                        />
                      </div>
                      <div className="form-group">
                        <h4>Images</h4>
                        <ImageUploadComponent
                          allowMultipleUploads={true}
                          setFieldValue={setFieldValue}
                          fieldName="images"
                          imageLinks={values.images}
                        />
                      </div>
                      <div className="form-group">
                        <h4>Review Ratings</h4>
                        <FieldArray name="customRatings">
                          {({ push, remove }) => (
                            <div>
                              {values?.customRatings?.map((rating, index) => (
                                <div key={index} className="d-flex mb-2">
                                  <Field
                                    name={`customRatings.${index}.ratingNumber`}
                                    placeholder="Rating Number"
                                    type="number"
                                    className="form-control ms-2"
                                  />
                                  <Field
                                    name={`customRatings.${index}.percentage`}
                                    placeholder="Percentage"
                                    type="number"
                                    className="form-control ms-2"
                                  />
                                  <Field
                                    name={`customRatings.${index}.noOfCustomer`}
                                    placeholder="Number of Customers"
                                    type="number"
                                    className="form-control ms-2"
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger ms-2"
                                    onClick={() => remove(index)}
                                  >
                                    -
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                  push({
                                    ratingNumber: "",
                                    percentage: "",
                                    noOfCustomer: "",
                                  })
                                }
                              >
                                Add Rating
                              </button>
                              {/* Set value to blank object when the last item is deleted */}
                              {values.customRatings?.length === 0 && (
                                <Field name="customRatings">
                                  {({ field }) => (
                                    <input {...field} type="hidden" value="" />
                                  )}
                                </Field>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="fs-5">
                        <strong>Thumbnail Image:</strong> {values.thumbnail}
                      </p>
                      <h4>Images</h4>
                      {values.images?.map((image, index) => (
                        <p key={index} className="fs-5">
                          {image}
                        </p>
                      ))}
                      <h4>Review Ratings</h4>
                      {values?.customRatings?.map((rating, index) => (
                        <p key={index} className="fs-6">
                          <strong>Rating Number:</strong> {rating.ratingNumber},{" "}
                          <strong>Percentage:</strong> {rating.percentage}%,{" "}
                          <strong>Number of Customers:</strong>{" "}
                          {rating.noOfCustomer}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!isChanged || updatingProduct}
                  onClick={(e) => handleSubmit(e, values)}
                >
                  {updatingProduct && (
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    />
                  )}
                  <span role="status">Update Product</span>
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateProduct;
