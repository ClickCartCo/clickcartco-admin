import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import couponReducer from "../features/coupon/couponSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    pCategory: pCategoryReducer,
    enquiry: enquiryReducer,
    coupon: couponReducer,
  },
});
