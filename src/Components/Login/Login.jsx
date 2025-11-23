
              import React, { useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import styles from './Login.module.css';
import { UserContext } from '../context/userContext';

export default function Login() {
  const navigate = useNavigate();
  const { setLogin } = useContext(UserContext);

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/auth/signin',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.message === 'success') {
        localStorage.setItem('userToken', response.data.token);
        setLogin(true);         
        navigate('/Home');       
      }

    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.formHeader}>Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? styles.inputError : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.password && formik.errors.password ? styles.inputError : ''}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Login</button>
        </form>

        <p className={styles.redirectText}>
          Don't have an account?
          <span className={styles.redirectLink} onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
