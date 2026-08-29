import React, { Component } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BackOffice from "./pages/BackOffice";

class App extends Component {
  render() {
    let page = "/";
    const loc = document.location.href;

    if (loc.indexOf('/?') > 0) {
      page = loc.split('/?')[1];
      page = page.split('=')[0];
      page = page.split('&')[0];
      page = page.split('#')[0];
    }

    page = page.toLowerCase();

    switch (page) {
      case "app":
      case "backoffice":
        return (
          <Layout>
            <BackOffice />
          </Layout>
        );
      case "wallet":
      case "view":
      case "viewoffice":
        return (
          <Layout>
            <BackOffice isView />
          </Layout>
        );
      default:
        return (
          <Layout>
            <Home />
          </Layout>
        );
    }
  }
}

export default App;