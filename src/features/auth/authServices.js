import axios from "axios";
import { getAxiosConfig } from "../../utils/axiosconfig";
import { base_url, local_url } from "../../utils/baseUrl";
const login = async (user) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/api/user/login`,
    user
  );
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};
const getOrders = async () => {
  const response = await axios.get(`${base_url}api/order/`, getAxiosConfig());

  return response.data;
};
const getOrder = async (id) => {
  const response = await axios.get(
    `${base_url}api/order/${id}`,
    "",
    getAxiosConfig()
  );

  return response.data;
};

const updateOrder = async (id, payload) => {
  const response = await axios.post(
    `${base_url}api/order/${id}`,
    payload,
    getAxiosConfig()
  );
  return response.data;
};

const authService = {
  login,
  getOrders,
  getOrder,
  updateOrder,
};

export default authService;
