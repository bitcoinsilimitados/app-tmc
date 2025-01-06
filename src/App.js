import React, { Component } from "react";

import BackOffice from "./pages/BackOffice";
import Home from "./pages/Home"


class App extends Component {


  render() {
    let page = "/";
    let loc = document.location.href;

    if (loc.indexOf('/?') > 0) {

      page = loc.split('/?')[1];
      page = page.split('=')[0];
      page = page.split('&')[0];
      page = page.split('#')[0];
    }

    page = page.toLowerCase();

    switch (page) {
      case "app":
      case "backoffice": return (<BackOffice />);

      case "wallet":
      case "view":
      case "viewoffice": return (<BackOffice isView />);

      default: return (<Home />);
    }


  }
}

export default App;

