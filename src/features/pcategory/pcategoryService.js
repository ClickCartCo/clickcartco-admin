import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getProductCategories = async () => {
  const response = await axios.get(`${base_url}/api/category/get-all-category`);

  return response.data;
};
const createCategory = async (category) => {
  const response = await axios.post(
    `${base_url}/api/category/create-category`,
    category,
    config
  );

  return response.data;
};

const getProductCategory = async (id) => {
  const response = await axios.get(
    `${base_url}/api/category/get-all-category/${id}`,
    config
  );

  return response.data;
};

const updateProductCategory = async (category) => {
  const response = await axios.put(
    `${base_url}/api/category/update-category/${category.id}`,
    { updateFields: { name: category.pCatData.name } },
    config
  );

  return response.data;
};

const deleteProductCategory = async (id) => {
  const response = await axios.delete(
    `${base_url}/api/category/delete-category/${id}`,
    config
  );

  return response.data;
};

const pCategoryService = {
  getProductCategories,
  createCategory,
  getProductCategory,
  deleteProductCategory,
  updateProductCategory,
};

export default pCategoryService;
