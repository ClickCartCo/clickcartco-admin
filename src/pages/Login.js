import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthState } from "../features/auth/authSlice";
import { Eye, EyeSlash } from "react-bootstrap-icons";

let schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values))
        .then(() => {
          navigate("/admin");
        })
        .catch((error) => {});
    },
  });

  const { user, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, []);

  return (
    <div className="py-5" style={{ background: "#808080", minHeight: "100vh" }}>
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        <form onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Email Address"
            id="email"
            name="email"
            onChng={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
            val={formik.values.email}
          />
          <div className="error mt-2">
            {formik.touched.email && formik.errors.email}
          </div>

          <div className="position-relative">
            <CustomInput
              type={showPassword ? "text" : "password"}
              label="Password"
              id="pass"
              name="password"
              onChng={formik.handleChange("password")}
              onBlr={formik.handleBlur("password")}
              val={formik.values.password}
            />
            <button
              type="button"
              className="btn position-absolute top-50 end-0 translate-middle-y"
              onClick={togglePasswordVisibility}
              style={{ background: "transparent", border: "none" }}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="error mt-2">
            {formik.touched.password && formik.errors.password}
          </div>

          <div className="mb-3 text-end">
            <Link to="forgot-password">Forgot Password?</Link>
          </div>
          <div className="error text-center">{message}</div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isLoading || isSuccess}
            style={{ background: "#1155cc" }}
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              />
            )}
            <span role="status">Login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
