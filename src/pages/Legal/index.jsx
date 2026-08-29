import React, { Component } from "react";

export default class LegalPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { title, children } = this.props;
    return (
      <section id="legal-page" className="s-legal-page" style={styles.section}>
        <div className="row section-header" style={styles.headerRow}>
          <div className="col-full">
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.lastUpdated}>Última actualización: Agosto 2026</p>
          </div>
        </div>
        <div className="row" style={styles.contentRow}>
          <div className="col-full">
            <div style={styles.content}>
              {children}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const styles = {
  section: {
    paddingTop: "120px",
    paddingBottom: "80px",
    minHeight: "70vh",
    backgroundColor: "#0a0a0a",
    color: "#e0e0e0",
  },
  headerRow: {
    marginBottom: "40px",
  },
  title: {
    color: "#00ff88",
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  lastUpdated: {
    color: "#888",
    fontSize: "0.9rem",
  },
  contentRow: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  content: {
    fontSize: "1rem",
    lineHeight: "1.8",
  },
};

export const sectionStyle = {
  marginBottom: "30px",
};

export const h2Style = {
  color: "#ffffff",
  fontSize: "1.4rem",
  marginBottom: "15px",
  marginTop: "30px",
};

export const h3Style = {
  color: "#cccccc",
  fontSize: "1.15rem",
  marginBottom: "10px",
  marginTop: "20px",
};

export const pStyle = {
  marginBottom: "15px",
  color: "#b0b0b0",
};

export const ulStyle = {
  marginBottom: "15px",
  paddingLeft: "20px",
};

export const liStyle = {
  marginBottom: "8px",
  color: "#b0b0b0",
};

export const strongStyle = {
  color: "#ffffff",
};

export const boxStyle = {
  backgroundColor: "rgba(0, 255, 136, 0.05)",
  border: "1px solid rgba(0, 255, 136, 0.2)",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

export const warningBoxStyle = {
  backgroundColor: "rgba(255, 100, 100, 0.05)",
  border: "1px solid rgba(255, 100, 100, 0.3)",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};
