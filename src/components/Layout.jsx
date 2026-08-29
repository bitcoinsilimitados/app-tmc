import React, { Component } from "react";

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
};

export default class Layout extends Component {
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
    return (
      <>
        <header className="s-header">
          <div className="header-logo">
            <a className="site-logo" href="/">
              <img src="/images/TMC-blanco-verde.svg" height="100%" alt="Homepage" />
            </a>
          </div>

          <nav className="header-nav">
            <a href="#0" className="header-nav__close" title="close"><span>Close</span></a>

            <div className="header-nav__content">
              <h3>Navigation</h3>

              <ul className="header-nav__list">
                <li><a href="/" title="about">Home</a></li>
                <li><a href="/?backoffice" title="about">Back Office</a></li>
                <li><a href="/#view" title="about">Account Preview</a></li>
                <li><a id="contractAddress1" href="https://polygonscan.com/address/0xC76BeEf9Af888208820d7E7e84C3ec4B73a7e3A9">Contract</a></li>
              </ul>
            </div>
          </nav>
          <a className="header-menu-toggle" href="#0">
            <span className="header-menu-text">Menu</span>
            <span className="header-menu-icon"></span>
          </a>
        </header>

        <main>{this.props.children}</main>

        <footer>
          <div className="row footer-bottom">
            <div className="col-twelve">
              <div className="copyright">
                <span>© TheMonopolyClub</span>
                <br />
                <p><a id="contractAddress" href="https://polygonscan.com/address/0xC76BeEf9Af888208820d7E7e84C3ec4B73a7e3A9">Polygon Contract</a></p>
                <div style={styles.footerLinks}>
                  <a href="/?privacy" style={styles.footerLink}>Política de Privacidad</a>
                  <span style={styles.separator}>|</span>
                  <a href="/?terms" style={styles.footerLink}>Términos y Condiciones</a>
                  <span style={styles.separator}>|</span>
                  <a href="/?cookies" style={styles.footerLink}>Política de Cookies</a>
                  <span style={styles.separator}>|</span>
                  <a href="/?disclaimer" style={styles.footerLink}>Aviso Legal</a>
                </div>
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