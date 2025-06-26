const loginPageStyle = new CSSStyleSheet();
loginPageStyle.replaceSync(`
  .login-container {
    background-color: #fff;
    padding: 30px 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
    margin: auto;
  }

  .login-container h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #333;
  }

  .login-container input {
    width: 100%;
    padding: 10px 12px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }

  .login-container button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }

  .login-container button:hover {
    background-color: #0056b3;
  }

  .register-link {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: #555;
  }

  .register-link a {
    color: #007BFF;
    text-decoration: none;
  }

  .register-link a:hover {
    text-decoration: underline;
  }`);

export default loginPageStyle;
