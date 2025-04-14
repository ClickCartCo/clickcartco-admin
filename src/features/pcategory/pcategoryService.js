import axios from "axios";
import { getAxiosConfig } from "../../utils/axiosconfig";

const getProductCategories = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/category/get-all-category`
  );

  return response.data;
};
const createCategory = async (category) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/api/category/create-category`,
    category,
    getAxiosConfig()
  );

  return response.data;
};

const getProductCategory = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/category/get-all-category/${id}`,
    getAxiosConfig()
  );

  return response.data;
};

const updateProductCategory = async (category) => {
  const response = await axios.put(
    `${process.env.REACT_APP_API_BASE_URL}/api/category/update-category/${category.id}`,
    { updateFields: { name: category.pCatData.name } },
    getAxiosConfig()
  );

  return response.data;
};

const deleteProductCategory = async (id) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/api/category/delete-category/${id}`,
    getAxiosConfig()
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
