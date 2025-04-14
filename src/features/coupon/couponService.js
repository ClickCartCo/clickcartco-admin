import axios from "axios";
import { getAxiosConfig } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";
const getCoupons = async () => {
  const response = await axios.get(`${base_url}coupon/`, getAxiosConfig());

  return response.data;
};

const createCoupons = async (coupon) => {
  const response = await axios.post(
    `${base_url}coupon/`,
    coupon,
    getAxiosConfig()
  );

  return response.data;
};
const updateCoupon = async (coupon) => {
  const response = await axios.put(
    `${base_url}coupon/${coupon.id}`,
    {
      name: coupon.couponData.name,
      expiry: coupon.couponData.expiry,
      discount: coupon.couponData.discount,
    },
    getAxiosConfig()
  );

  return response.data;
};
const getCoupon = async (id) => {
  const response = await axios.get(`${base_url}coupon/${id}`, getAxiosConfig());

  return response.data;
};

const deleteCoupon = async (id) => {
  const response = await axios.delete(
    `${base_url}coupon/${id}`,
    getAxiosConfig()
  );

  return response.data;
};
const couponService = {
  getCoupons,
  createCoupons,
  deleteCoupon,
  getCoupon,
  updateCoupon,
};

export default couponService;
