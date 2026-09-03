import React, { Component } from "react";
import pkg from "../../package.json";
import { LangContext, SUPPORTED_LANGS } from "../i18n";

const LANG_LABELS = {
  es: "Español",
  en: "English",
};

const styles = {
  footerLinks: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  footerLink: {
    color: "#00ff88",
    fontSize: "0.8rem",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  separator: {
    color: "#555",
    fontSize: "0.8rem",
  },
  version: {
    color: "#555",
    fontSize: "0.75rem",
    marginTop: "4px",
  },
  langSelect: {
    backgroundColor: "#111",
    border: "1px solid #333",
    borderRadius: "4px",
    color: "#aaa",
    cursor: "pointer",
    display: "block",
    fontSize: "0.8rem",
    margin: "10px auto 0",
    padding: "5px 10px",
  },
};

export default class Layout extends Component {
  static contextType = LangContext;

  componentDidMount() {
    const $ = window.jQuery;
    if (!$) return;

    const menuTrigger = $('.header-menu-toggle');
    const nav = $('.header-nav');
    const closeButton = nav.find('.header-nav__close');
    const siteBody = $('body');

    const openMenu = (e) => {
      e.preventDefault();
      siteBody.toggleClass('menu-is-open');
    };

    const closeMenu = (e) => {
      e.preventDefault();
      siteBody.removeClass('menu-is-open');
    };

    const closeOutside = (e) => {
      if (!$(e.target).is('.header-nav, .header-nav__content, .header-menu-toggle, .header-menu-toggle span')) {
        siteBody.removeClass('menu-is-open');
      }
    };

    menuTrigger.off('click').on('click', openMenu);
    closeButton.off('click').on('click', closeMenu);
    siteBody.off('click', closeOutside).on('click', closeOutside);
  }

  render() {
    const { lang, t, setLang } = this.context;

    return (
      <>
        <header className="s-header">
          <div className="header-logo">
            <a className="site-logo" href="/">
              <img src="/images/TMC-blanco-verde.svg" height="100%" alt="Homepage" />
            </a>
          </div>

          <nav className="header-nav">
            <a href="#0" className="header-nav__close" title="close"><span>{t("Cerrar")}</span></a>

            <div className="header-nav__content">
              <h3>{t("Navegación")}</h3>

              <ul className="header-nav__list">
                <li><a href="/" title="about">{t("Inicio")}</a></li>
                <li><a href="/?backoffice" title="about">{t("Back Office")}</a></li>
                <li><a href="/#view" title="about">{t("Visualizar Cuenta")}</a></li>
                <li><a id="contractAddress1" href="https://polygonscan.com/address/0xC76BeEf9Af888208820d7E7e84C3ec4B73a7e3A9">{t("Contrato")}</a></li>
              </ul>
            </div>
          </nav>
          <a className="header-menu-toggle" href="#0">
            <span className="header-menu-text">{t("Menú")}</span>
            <span className="header-menu-icon"></span>
          </a>
        </header>

        <main>{this.props.children}</main>

        <footer>
          <div className="row footer-bottom">
            <div className="col-twelve">
              <div className="copyright">
                <span>© TheMonopolyClub {new Date().getFullYear()}</span>
                <br />
                <span style={styles.version}>App v{pkg.version}</span>
                <br />
                <p><a id="contractAddress" href="https://polygonscan.com/address/0xC76BeEf9Af888208820d7E7e84C3ec4B73a7e3A9">{t("Contrato en Polygon")}</a></p>
                <div style={styles.footerLinks}>
                  <a href="/?privacy" style={styles.footerLink}>{t("Política de Privacidad")}</a>
                  <span style={styles.separator}>|</span>
                  <a href="/?terms" style={styles.footerLink}>{t("Términos y Condiciones")}</a>
                  <span style={styles.separator}>|</span>
                  <a href="/?cookies" style={styles.footerLink}>{t("Política de Cookies")}</a>
                  <span style={styles.separator}>|</span>
                  <a href="/?disclaimer" style={styles.footerLink}>{t("Aviso Legal")}</a>
                </div>
                <select
                  style={styles.langSelect}
                  value={lang}
                  aria-label={t("Seleccionar idioma")}
                  onChange={(e) => setLang(e.target.value)}
                >
                  {SUPPORTED_LANGS.map((code) => (
                    <option key={code} value={code}>
                      {LANG_LABELS[code] || code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="go-top">
                <a className="smoothscroll" title="Back to Top" href="#top"><i className="icon-arrow-up" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }
}