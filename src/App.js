import React, { Component } from "react";

import BackOffice from "./components/BackOffice";
import Home from "./pages/Home"


class App extends Component {
  

  render() {
    let page = "/";
    let loc = document.location.href;

    if (loc.indexOf('/?') > 0) {

      page = loc.split('/?')[1];
      page = page.split('#')[0];
    }

    console.log(page)


    switch (page) {
      case "BackOffice":
      case "backOffice":
      case "backoffice": return (<BackOffice />);

      case "ViewOffice":
      case "viewOffice":
      case "viewoffice": return (<BackOffice />);

      default: return (<Home />);
    }


  }
}

export default App;

