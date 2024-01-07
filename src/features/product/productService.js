import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  const response = await axios.get(`${base_url}/api/product/get-all-product`);

  return response.data;
};
const createProduct = async (product) => {
  // const response = await axios.post(`${base_url}product/`, product, config);
  const response = await axios.post(
    `${base_url}/api/product/create-product`,
    product
  );

  return response.data;
};

const productService = {
  getProducts,
  createProduct,
};

export default productService;
