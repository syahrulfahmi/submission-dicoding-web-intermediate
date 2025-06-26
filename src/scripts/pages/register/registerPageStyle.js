const registerPageStyle = new CSSStyleSheet();
registerPageStyle.replaceSync(`
  .register-container {
    background-color: #fff;
    padding: 30px 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
    margin: auto;
  }

  .register-container h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #333;
  }

  .register-container input {
    width: 100%;
    padding: 10px 12px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }

  .register-container button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }

  .register-container button:hover {
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

export default registerPageStyle;
