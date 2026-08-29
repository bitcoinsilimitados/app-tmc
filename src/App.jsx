import React, { Component } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BackOffice from "./pages/BackOffice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import SiteData from "./pages/SiteData/_page.jsx";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import Web3 from "web3";
import abiTMC from "./assets/abi/TMC-v2.js";
import Utils from "./Utils/index.js";

const RPC = Utils.rpc;
const contractAddress = Utils.contract;
const web3 = new Web3(RPC);
const contract = new web3.eth.Contract(abiTMC, contractAddress);

async function getLastUserId() {
  try {
    const lastUserId = await contract.methods
      .lastUserId()
      .call({ from: "0x0000000000000000000000000000000000000000" });
    return parseInt(lastUserId).toString();
  } catch (error) {
    console.error("Error al obtener lastUserId:", error);
    return "###";
  }
}

async function getRecentUsers() {
  const maxBlockRange = 10000;
  const promedio = 20000;
  try {
    const latestBlock = parseInt(await web3.eth.getBlockNumber());
    const latestBlockInfo = await web3.eth.getBlock(latestBlock);
    const startBlockForAvg = Math.max(latestBlock - promedio, 0);
    const latestBlockInfo2 = await web3.eth.getBlock(startBlockForAvg);

    let averageBlockTime =
      (parseInt(latestBlockInfo.timestamp) -
        parseInt(latestBlockInfo2.timestamp)) /
      promedio;

    if (!averageBlockTime || averageBlockTime <= 0) {
      averageBlockTime = 2;
    }

    const blocksIn24Hours = Math.floor((24 * 60 * 60) / averageBlockTime);
    const startBlock = Math.max(latestBlock - blocksIn24Hours, 0);

    console.log(
      `Consultando eventos desde el bloque ${startBlock} hasta ${latestBlock} total de bloques ${latestBlock - startBlock}`
    );

    let totalEvents = 0;
    let currentBlock = startBlock;

    while (currentBlock < latestBlock) {
      const endBlock = Math.min(currentBlock + maxBlockRange - 1, latestBlock);
      console.log(`Consultando bloques ${currentBlock} a ${endBlock}`);

      const events = await contract.getPastEvents("Registration", {
        fromBlock: currentBlock,
        toBlock: endBlock,
      });

      totalEvents += events.length;
      currentBlock = endBlock + 1;
    }

    return totalEvents;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: "###",
      last24: "###",
    };
  }

  componentDidMount() {
    getLastUserId().then((r) => {
      console.log("[App] getLastUserId ->", r);
      this.setState({ users: r });
    });
    getRecentUsers().then((r) => {
      console.log("[App] getRecentUsers ->", r);
      this.setState({ last24: r });
    });
  }

  render() {
    let page = "/";
    const loc = document.location.href;

    if (loc.indexOf("/?") > 0) {
      page = loc.split("/?")[1];
      page = page.split("=")[0];
      page = page.split("&")[0];
      page = page.split("#")[0];
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
      case "privacy":
      case "privacy-policy":
        return (
          <Layout>
            <PrivacyPolicy />
          </Layout>
        );
      case "terms":
      case "terms-and-conditions":
        return (
          <Layout>
            <TermsAndConditions />
          </Layout>
        );
      case "cookies":
      case "cookie-policy":
        return (
          <Layout>
            <SiteData />
          </Layout>
        );
      case "disclaimer":
      case "legal":
      case "legal-disclaimer":
        return (
          <Layout>
            <LegalDisclaimer />
          </Layout>
        );
      default:
        return (
          <Layout>
            <Home {...this.state} />
          </Layout>
        );
    }
  }
}

export default App;
