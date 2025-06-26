import registerPageStyle from './registerPageStyle';

export default class RegisterPage {
  async render() {
    return `
      <div class="register-container">
        <h2>Daftar</h2>
        <form>
          <input type="name" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Kata Sandi" required />
          <button type="submit">Masuk</button>
        </form>
        <div class="register-link">
          Sudah punya akun? <a href="#/login">Masuk</a>
        </div>
      </div>
    `;
  }

  updateStyle() {
    if ('adoptedStyleSheets' in document) {
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        registerPageStyle,
      ];
    } else {
      const style = document.createElement('style');
      style.textContent = registerPageStyle.cssRules
        ? Array.from(registerPageStyle.cssRules)
            .map((rule) => rule.cssText)
            .join('\n')
        : '';
      document.head.appendChild(style);
    }
  }

  async afterRender() {
    // Do your job here
    this.updateStyle();
  }
}
