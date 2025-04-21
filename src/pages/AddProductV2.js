import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { createProducts, resetState } from "../features/product/productSlice";
import { toast } from "react-toastify";
import StepOne from "./AddProductComponents/StepOne";
import StepTwo from "./AddProductComponents/StepTwo";
import ImageUploadComponent from "./AddProductComponents/ImageUploadComponent";
import { getValidationSchema } from "./AddProductComponents/helpers/productHelpers";

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
    const savedData = JSON.parse(localStorage.getItem("productFormData"));
    if (savedData && formRef.current) {
      formRef.current.setValues(savedData);
      if (savedData.specifications) {
        setSpecificationValue(savedData.specifications);
      }
      if (savedData.productAttributes) {
        setProductAttr(savedData.productAttributes);
      }
    }

    const interval = setInterval(() => {
      const formik = formRef.current;
      if (
        formik &&
        formik.values &&
        Array.isArray(formik.values.customRatings)
      ) {
        const totalCustomers = formik.values.customRatings.reduce(
          (acc, curr) => {
            const num = Number(curr.noOfCustomer);
            return acc + (isNaN(num) ? 0 : num);
          },
          0
        );

        const updatedRatings = formik.values.customRatings.map((rating) => {
          const num = Number(rating.noOfCustomer);
          const percentage =
            totalCustomers > 0
              ? parseFloat(((num / totalCustomers) * 100).toFixed(2))
              : 0;
          return {
            ...rating,
            percentage,
          };
        });

        // Only update if there's a change to avoid unnecessary rerenders
        const hasChanges =
          JSON.stringify(formik.values.customRatings) !==
          JSON.stringify(updatedRatings);
        if (hasChanges) {
          formik.setFieldValue("customRatings", updatedRatings);
        }
      }
    }, 500);

    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    return () => {
      if (!isPageRefreshed) {
        localStorage.removeItem("productFormData");
      }
      clearInterval(interval);
    };
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
      localStorage.removeItem("productFormData");
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

  // Trigger form validation on step change
  useEffect(() => {
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [step]);

  useEffect(() => {
    const shouldUpdate =
      (specificationValue && Object.keys(specificationValue).length > 0) ||
      (productAttr && productAttr.length > 0);

    if (!shouldUpdate) return;

    const productFormData = {
      ...JSON.parse(localStorage.getItem("productFormData") || "{}"),
      specifications: specificationValue,
      productAttributes: productAttr,
    };

    // Save the updated productFormData to localStorage
    localStorage.setItem("productFormData", JSON.stringify(productFormData));
  }, [specificationValue, productAttr]);

  const initialValues = JSON.parse(localStorage.getItem("productFormData")) || {
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
    const values = Object.values(obj);
    return values.length > 0 && !values.some((item) => item === "");
  };

  const handleNext = async () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => setStep((prev) => prev - 1);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Product</h1>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={getValidationSchema(step)}
        onSubmit={(values, { resetForm }) => {
          const payload = {
            ...values,
            specifications: { ...specificationValue },
            productAttributes: { ...productAttr },
          };
          dispatch(createProducts(payload));
          localStorage.removeItem("productFormData");
          resetFormRef.current = resetForm;
        }}
      >
        {({ isValid, values, errors, touched, setFieldValue }) => {
          const allFieldsValid = isValid && objectHasData(specificationValue);
          localStorage.setItem("productFormData", JSON.stringify(values));
          return (
            <Form>
              {step === 1 && (
                <StepOne
                  categories={catState}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              )}
              {step === 2 && (
                <StepTwo
                  values={values}
                  errors={errors}
                  touched={touched}
                  specificationName={specificationName}
                  setSpecificationName={setSpecificationName}
                  specificationValue={specificationValue}
                  setSpecificationValue={setSpecificationValue}
                  productAttrName={productAttrName}
                  setProductAttrName={setProductAttrName}
                  productAttr={productAttr}
                  setProductAttr={setProductAttr}
                />
              )}
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
                    <ImageUploadComponent
                      setFieldValue={setFieldValue}
                      fieldName="thumbnail"
                      imageLinks={
                        values.thumbnail !== "" ? [values.thumbnail] : []
                      }
                    />
                  </div>
                  <div className="form-group mb-2">
                    <h4>Images</h4>

                    <ImageUploadComponent
                      allowMultipleUploads={true}
                      setFieldValue={setFieldValue}
                      fieldName="images"
                      imageLinks={values.images}
                    />
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
                                readOnly
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrevious}
                  disabled={step === 1}
                >
                  Previous
                </button>
                {step < 4 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={
                      step === 2 ? !objectHasData(specificationValue) : !isValid
                    }
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
