import axios from "axios";
import { config } from "../../utils/axiosconfig";

const getProducts = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/product/get-all-product`
  );

  return response.data;
};
const createProduct = async (product) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/api/product/create-product`,
    product,
    config
  );
  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/api/product/delete-product/${productId}`,
    config
  );
  return response.data;
};

const productService = {
  getProducts,
  createProduct,
  deleteProduct,
};

export default productService;
