import { configureStore } from "@reduxjs/toolkit";
import authReducer, { signout } from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import couponReducer from "../features/coupon/couponSlice";

// Custom middleware to intercept 401 errors
const errorHandlingMiddleware = (store) => (next) => (action) => {
  // Check if action contains a 401 error
  if (action?.payload === "Request failed with status code 401") {
    store.dispatch(signout());
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    pCategory: pCategoryReducer,
    enquiry: enquiryReducer,
    coupon: couponReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorHandlingMiddleware),
});
