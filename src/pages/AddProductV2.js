import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import QuillEditor from "../components/QuillEditor";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { createProducts, resetState } from "../features/product/productSlice";
import { toast } from "react-toastify";

const AddProductV2 = () => {
  const [step, setStep] = useState(1);
  const [specificationName, setSpecificationName] = useState("");
  const [specificationValue, setSpecificationValue] = useState({});
  const [productAttrName, setProductAttrName] = useState("");
  const [productAttr, setProductAttr] = useState({});
  const catState = useSelector((state) => state.pCategory.pCategories);
  const createdProduct = useSelector((state) => state.product.isSuccess);
  const loadingProduct = useSelector((state) => state.product.isLoading);
  const isError = useSelector((state) => state.product.isError);
  const formRef = useRef(null);
  const resetFormRef = useRef(null);
  const [formTouched, setFormTouched] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    if (createdProduct) {
      setProductAttr({});
      setSpecificationValue({});
      if (resetFormRef.current) {
        resetFormRef.current();
      }
      setStep(1);
      toast.success("Product Added Successfullly!");
      dispatch(resetState());
    }
    if (isError) {
      toast.error("Product could not be created!");
    }
  }, [createdProduct, isError]);

  useEffect(() => {
    if (formRef.current && formTouched) {
      const touchedState = Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      formRef.current.setTouched(touchedState);
    }
  }, [formTouched]);

  const addSpecification = () => {
    const newKey = specificationName;
    setSpecificationValue({
      ...specificationValue,
      [newKey]: "",
    });
    setSpecificationName("");
  };

  const removeSpecification = (key) => {
    const { [key]: _, ...updatedSpecification } = specificationValue;
    setSpecificationValue(updatedSpecification);
  };

  const handleSpecificationChange = (key, value) => {
    setSpecificationValue({
      ...specificationValue,
      [key]: value,
    });
  };

  const addProductAttr = () => {
    const newKey = productAttrName;
    setProductAttr({
      ...productAttr,
      [newKey]: [""],
    });
    setProductAttrName("");
  };

  const removeProductAttr = (key) => {
    const { [key]: _, ...updatedFields } = productAttr;
    setProductAttr(updatedFields);
  };

  const handleProductAttrChange = (key, index, value) => {
    const updatedAttrValues = [...productAttr[key]];
    updatedAttrValues[index] = value;
    setProductAttr({
      ...productAttr,
      [key]: updatedAttrValues,
    });
  };

  const addProductAttrValue = (key) => {
    setProductAttr({
      ...productAttr,
      [key]: [...productAttr[key], ""],
    });
  };

  const removeProductAttrValue = (key, index) => {
    const updatedAttrValues = productAttr[key].filter((_, i) => i !== index);
    if (updatedAttrValues.length === 0) {
      removeProductAttr(key);
    } else {
      setProductAttr({
        ...productAttr,
        [key]: updatedAttrValues,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    // Define validation for each step
    title: step === 1 ? Yup.string().required("Required") : null,
    description: step === 1 ? Yup.string().required("Required") : null,
    price: step === 1 ? Yup.number().required("Required") : null,
    brand: step === 1 ? Yup.string().required("Required") : null,
    category: step === 1 ? Yup.string().required("Required") : null,
    // specifications: step === 2 ? Yup.string().required("Required") : null,
    // productAttributes: step === 2 ? Yup.string().required("Required") : null,
    inStock: step === 3 ? Yup.string().required("Required") : null,
    tags: step === 3 ? Yup.string().required("Required") : null,
    thumbnail: step === 4 ? Yup.string().required("Required") : null,
    images:
      step === 4
        ? Yup.array().of(Yup.string().required("Required")).required("Required")
        : null,
    customRatings:
      step === 4
        ? Yup.array()
            .of(
              Yup.object().shape({
                ratingNumber: Yup.number().required("Required"),
                percentage: Yup.number().required("Required"),
                noOfCustomer: Yup.number().required("Required"),
              })
            )
            .required("At least one review rating is required")
        : null,
  });

  const initialValues = {
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    inStock: "",
    tags: "",
    thumbnail: "",
    images: [],
    color: [""],
    customRatings: [],
  };

  const objectHasData = (obj) => {
    return Object.values(obj).length > 0;
  };

  const handleNext = async () => {
    // if (!formTouched) {
    //   setFormTouched(true);
    // }
    // const isValid = await formRef.current.validateForm();
    // const formErrors = await formRef.current.errors;
    // const hasRequiredErrors = Object.values(formErrors).some(
    //   (error) => error === "Required"
    // );
    // if (isValid && !hasRequiredErrors && objectHasData(specificationValue)) {
    //   setStep((prev) => prev + 1);
    // }
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => setStep((prev) => prev - 1);

  const stepOne = (values, errors, touched) => {
    return (
      <div>
        <div className="form-group">
          <label htmlFor={"title"}>
            <h4>Product Title</h4>
          </label>
          <Field name="title" className="form-control" />
          {errors.title && touched.title ? (
            <div className="text-danger">{errors.title}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>
            <h4>Description</h4>
          </label>
          <QuillEditor name="description" />
        </div>
        <div className="form-group">
          <label>
            <h4>Price</h4>
          </label>
          <Field name="price" type="number" className="form-control" />
          {errors.price && touched.price ? (
            <div className="text-danger">{errors.price}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>
            <h4>Brand</h4>
          </label>
          <Field name="brand" className="form-control" />
          {errors.brand && touched.brand ? (
            <div className="text-danger">{errors.brand}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>
            <h4>Category</h4>
          </label>
          <Field as="select" name="category" className="form-control">
            <option value="" label="Select category" />
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
          {errors.category && touched.category ? (
            <div className="text-danger">{errors.category}</div>
          ) : null}
        </div>
      </div>
    );
  };

  const stepTwo = (values, errors, touched) => {
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
                  className="btn btn-primary"
                  onClick={addSpecification}
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
                  className="btn btn-primary"
                  onClick={addProductAttr}
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Product</h1>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const payload = {
            ...values,
            specifications: { ...specificationValue },
            productAttributes: { ...productAttr },
          };
          dispatch(createProducts(payload));
          resetFormRef.current = resetForm;
        }}
      >
        {({ isValid, values, errors, touched }) => {
          const allFieldsValid = isValid && objectHasData(specificationValue);
          return (
            <Form>
              {step === 1 && stepOne(values, errors, touched)}
              {step === 2 && stepTwo(values, errors, touched)}
              {step === 3 && (
                <div>
                  <div className="form-group">
                    <h4>In Stock</h4>
                    <Field as="select" name="inStock" className="form-control">
                      <option value="" label="Select stock status" />
                      <option value="true" label="True" />
                      <option value="false" label="False" />
                    </Field>
                    {errors.inStock && touched.inStock ? (
                      <div className="text-danger">{errors.inStock}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <h4>Product Sale Type</h4>
                    <Field as="select" name="tags" className="form-control">
                      <option value="" label="Select sale type" />
                      <option value="regular" label="Regular" />
                      <option value="featured" label="Featured" />
                      <option value="popular" label="Popular" />
                    </Field>
                    {errors.tags && touched.tags ? (
                      <div className="text-danger">{errors.tags}</div>
                    ) : null}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <div className="form-group mb-2">
                    <h4>Thumbnail</h4>
                    <Field name="thumbnail" className="form-control" />
                    {errors.thumbnail && touched.thumbnail ? (
                      <div className="text-danger">{errors.thumbnail}</div>
                    ) : null}
                  </div>
                  <div className="form-group mb-2">
                    <h4>Images</h4>
                    <FieldArray name="images">
                      {({ push, remove }) => (
                        <div>
                          {values.images.map((image, index) => (
                            <div key={index} className="d-flex mb-2">
                              <Field
                                name={`images.${index}`}
                                className="form-control mr-2"
                              />
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => remove(index)}
                              >
                                -
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => push("")}
                          >
                            Add Image
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div className="form-group mb-2">
                    <h4>Review Ratings</h4>
                    <FieldArray name="customRatings" className="form-control">
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
                        </div>
                      )}
                    </FieldArray>
                    {errors.customRatings &&
                    typeof errors.customRatings === "string" ? (
                      <div className="text-danger">{errors.customRatings}</div>
                    ) : null}
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-between mt-4">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={!allFieldsValid || loadingProduct}
                  >
                    Submit
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddProductV2;
