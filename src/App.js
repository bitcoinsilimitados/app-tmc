import React, { Component } from "react";

import BackOffice from "./pages/BackOffice";
import Home from "./pages/Home"

import Web3 from "web3";
import abiTMC from "./assets/abi/TMC-v2.js";
import Utils from "./Utils/index.js";

const RPC = Utils.rpc;
const contractAddress = Utils.contract; // Dirección del contrato
const web3 = new Web3(RPC);
const contract = new web3.eth.Contract(abiTMC, contractAddress);

async function getLastUserId() {

  try {
    const lastUserId = await contract.methods.lastUserId().call({ from: "0x0000000000000000000000000000000000000000" });
    console.log("Último ID de usuario:", lastUserId.toString());
    return (parseInt(lastUserId) - 1).toString();
  } catch (error) {
    console.error("Error al obtener lastUserId:", error);
    return "###"
  }
}


async function getRecentUsers() {
  const promedio = 20000

  // Obtener información del último bloque
  const latestBlock = parseInt(await web3.eth.getBlockNumber());
  const latestBlockInfo = await web3.eth.getBlock(latestBlock);

  const latestBlock2 = parseInt(await web3.eth.getBlockNumber());
  const latestBlockInfo2 = await web3.eth.getBlock(latestBlock2 - promedio);

  // Calcular el bloque aproximado de hace 24 horas
  const averageBlockTime = (parseInt(latestBlockInfo.timestamp) - parseInt(latestBlockInfo2.timestamp)) / promedio // Tiempo promedio entre bloques en segundos
  const blocksIn24Hours = Math.floor(24 * 60 * 60 / averageBlockTime);
  const startBlock = Math.max(latestBlock - blocksIn24Hours, 0);

  //console.log(`Consultando eventos desde el bloque ${startBlock} hasta ${latestBlock} total de bloques ${latestBlock - startBlock}`);

  try {

    const events = await contract.getPastEvents('Registration', {
      fromBlock: startBlock, // O un bloque específico si prefieres limitar la búsqueda
      toBlock: latestBlock,
    });
    //console.log('Usuarios en las últimas 24 horas:', events.length);
    console.log(events)
    return events.length;

  } catch (error) {
    console.log(error)
    return 0;

  }

}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: "###",
      last24: "###"
    }
  }

  componentDidMount() {
    getLastUserId().then((r) => {
      this.setState({ users: r })
    })

    getRecentUsers().then((r) => {
      this.setState({ last24: r })
    })
  }


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
      case "backoffice": return (<BackOffice {...this.state} />);

      case "wallet":
      case "view":
      case "viewoffice": return (<BackOffice isView {...this.state} />);

      default: return (<Home {...this.state} />);
    }


  }
}

export default App;

