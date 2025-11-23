
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "../context/userContext";
import styles from "./Register.module.css";

export default function Register() {
  const { setLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        formData
      );

      if (response.data.message === "success") {
        localStorage.setItem("userToken", response.data.token);
        setLogin(true);    
        navigate("/Home");    
      }

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required().min(3).max(10),
    email: Yup.string().required().email(),
    phone: Yup.string().required().matches(/^01[0125][0-9]{8}$/),
    password: Yup.string()
      .required()
      .matches(/^[A-Z][a-z0-9]{6,8}$/),
    rePassword: Yup.string()
      .required()
      .oneOf([Yup.ref("password")]),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", rePassword: "" },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.formHeader}>Create Account</h2>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          {["name", "email", "phone", "password", "rePassword"].map((field) => (
            <div className={styles.formGroup} key={field}>
              <input
                type={field.includes("password") ? "password" : field === "phone" ? "tel" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched[field] && formik.errors[field] ? styles.inputError : ""}
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className={styles.errorMsg}>{formik.errors[field]}</div>
              )}
            </div>
          ))}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>

        <p className={styles.redirectText}>
          Already have an account?
          <span className={styles.redirectLink} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
