import * as Yup from "yup";

export const addSpecification = (
  specificationName,
  specificationValue,
  setSpecificationName,
  setSpecificationValue
) => {
  const newKey = specificationName;
  setSpecificationValue({
    ...specificationValue,
    [newKey]: "",
  });
  setSpecificationName("");
};

export const removeSpecification = (
  key,
  specificationValue,
  setSpecificationValue
) => {
  const { [key]: _, ...updatedSpecification } = specificationValue;
  setSpecificationValue(updatedSpecification);
};

export const handleSpecificationChange = (
  key,
  value,
  specificationValue,
  setSpecificationValue
) => {
  setSpecificationValue({
    ...specificationValue,
    [key]: value,
  });
};

export const addProductAttr = (
  productAttrName,
  productAttr,
  setProductAttrName,
  setProductAttr
) => {
  const newKey = productAttrName;
  setProductAttr({
    ...productAttr,
    [newKey]: [""],
  });
  setProductAttrName("");
};

export const removeProductAttr = (key, productAttr, setProductAttr) => {
  const { [key]: _, ...updatedFields } = productAttr;
  setProductAttr(updatedFields);
};

export const addProductAttrValue = (key, productAttr, setProductAttr) => {
  setProductAttr({
    ...productAttr,
    [key]: [...productAttr[key], ""],
  });
};

export const removeProductAttrValue = (
  key,
  index,
  productAttr,
  setProductAttr
) => {
  const updatedAttrValues = productAttr[key].filter((_, i) => i !== index);
  if (updatedAttrValues.length === 0) {
    removeProductAttr(key, productAttr, setProductAttr);
  } else {
    setProductAttr({
      ...productAttr,
      [key]: updatedAttrValues,
    });
  }
};

export const handleProductAttrChange = (
  key,
  index,
  value,
  productAttr,
  setProductAttr
) => {
  const updatedAttrValues = [...productAttr[key]];
  updatedAttrValues[index] = value;
  setProductAttr({
    ...productAttr,
    [key]: updatedAttrValues,
  });
};

export const getValidationSchema = (step) => {
  const baseSchema = Yup.object().shape({
    // Step 1 Fields
    title: step === 1 ? Yup.string().required("Required") : Yup.string(),
    description: step === 1 ? Yup.string().required("Required") : Yup.string(),
    price: step === 1 ? Yup.number().required("Required") : Yup.number(),
    brand: step === 1 ? Yup.string().required("Required") : Yup.string(),
    category: step === 1 ? Yup.string().required("Required") : Yup.string(),

    // Step 3 Fields
    inStock: step === 3 ? Yup.string().required("Required") : Yup.string(),
    tags: step === 3 ? Yup.string().required("Required") : Yup.string(),

    // Step 4 Fields
    thumbnail: step === 4 ? Yup.string().required("Required") : Yup.string(),
    images:
      step === 4
        ? Yup.array().of(Yup.string().required("Required")).required("Required")
        : Yup.array().nullable(),
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
        : Yup.array().nullable(),
  });

  return baseSchema;
};

export const addProductFormInitialValues = JSON.parse(
  localStorage.getItem("productFormData")
) || {
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
