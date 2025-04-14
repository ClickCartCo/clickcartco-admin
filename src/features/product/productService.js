import axios from "axios";
import { getAxiosConfig } from "../../utils/axiosconfig";

const getProducts = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/product/get-all-product`
  );

  return response.data;
};

const getProductDetails = async (productId) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/product/get-product/${productId}`
  );

  return response.data;
};

const createProduct = async (product) => {
  const originalUrl = `${process.env.REACT_APP_API_BASE_URL}/api/product/create-product`;
  const response = await axios.post(originalUrl, product, getAxiosConfig());
  console.log("Response", response);
  return response.data;
};

const updateProduct = async (payload) => {
  const { productId, updatedProductInfo } = payload;
  const remote = `${process.env.REACT_APP_API_BASE_URL}/api/product/update-product/${productId}`;
  const response = await axios.put(
    remote,
    { updatedProductInfo },
    getAxiosConfig()
  );

  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/api/product/delete-product/${productId}`,
    getAxiosConfig()
  );
  return response.data;
};

const productService = {
  getProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
