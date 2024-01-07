import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { createProducts, resetState } from "../features/product/productSlice";
let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup.string().required("Color is Required"),
  inStock: yup.bool().required("Instock is Required"),
  thumbnail: yup.string().required("Thumbnail link is required"),
  images: yup.string().required("Images link is required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const catState = useSelector((state) => state.pCategory.pCategories);
  // const catState = [
  //   { title: "Electronics", id: "656c85892eef9be27502ac15" },
  //   { title: "Appliances", id: "656c85892eef9be27502ac15" },
  //   { title: "Baby Care", id: "656c85892eef9be27502ac15" },
  // ];
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;
  const [specificationName, setSpecificationName] = useState("");
  const [fields, setFields] = useState({});

  const addField = () => {
    const newKey = specificationName;
    setFields({
      ...fields,
      [newKey]: "",
    });
    setSpecificationName("");
  };

  const removeField = (key) => {
    const { [key]: _, ...updatedFields } = fields;
    setFields(updatedFields);
  };

  const handleChangeValue = (key, value) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      tags: "",
      color: "",
      inStock: "",
      thumbnail: "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      values.color = values.color.split(",");
      values.images = values.images.split(",");
      values = { ...values, specifications: { ...fields } };
      dispatch(createProducts(values));
      setFields({});
      formik.values.color = "";
      formik.resetForm();
      setTimeout(() => {
        dispatch(resetState());
      }, 3000);
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <p>Description</p>
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
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
                  onClick={addField}
                  disabled={!specificationName}
                >
                  Add Field
                </button>
              </div>
            </div>
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="mt-3">
                <input
                  type="text"
                  placeholder={`Specification ${key.slice(13)}`}
                  value={key}
                  disabled
                />
                <input
                  type="text"
                  placeholder={`Value for Specification ${key.slice(13)}`}
                  onChange={(e) => handleChangeValue(key, e.target.value)}
                />
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => removeField(key)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i._id}>
                  {i.name}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <CustomInput
            type="text"
            label="Enter Brand"
            name="title"
            onChng={formik.handleChange("brand")}
            onBlr={formik.handleBlur("brand")}
            val={formik.values.brand}
          />
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <CustomInput
            type="text"
            label="Enter Color Options"
            name="color"
            onChng={formik.handleChange("color")}
            onBlr={formik.handleBlur("color")}
            value={formik.values.color}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Product Sale Type
            </option>
            <option value="regular">Regular</option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          <select
            name="inStock"
            onChange={formik.handleChange("inStock")}
            onBlur={formik.handleBlur("inStock")}
            value={formik.values.inStock}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Set if in stock
            </option>
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
          <div className="error">
            {formik.touched.inStock && formik.errors.inStock}
          </div>
          <CustomInput
            type="text"
            label="Enter Thumnail image link"
            name="title"
            onChng={formik.handleChange("thumbnail")}
            onBlr={formik.handleBlur("thumbnail")}
            val={formik.values.thumbnail}
          />
          <div className="error">
            {formik.touched.thumbnail && formik.errors.thumbnail}
          </div>
          <CustomInput
            type="text"
            label="Enter Images links"
            name="title"
            onChng={formik.handleChange("images")}
            onBlr={formik.handleBlur("images")}
            val={formik.values.images}
          />
          <div className="error">
            {formik.touched.images && formik.errors.images}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
