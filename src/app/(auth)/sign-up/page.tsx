import React, { useState } from 'react';
import './SignupPage.css';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    return (
      formData.username.trim() &&
      /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(formData.email) &&
      formData.password &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {submitted ? (
        <div className="success-message">Thank you for signing up!</div>
      ) : (
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">Sign Up</button>
        </form>
      )}
    </div>
  );
}

export default SignupPage;
