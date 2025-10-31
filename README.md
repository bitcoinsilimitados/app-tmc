# BASE-USDT-Forsage

DApp de crowdfunding en blockchain Polygon para sistema de matriz 3x15 con tokens ERC20 (USDT/USDC/DAI).

## 📋 Requisitos

- **Node.js** v14 o superior
- **npm** v6 o superior
- **MetaMask** o wallet compatible con Polygon
- Tokens USDT/USDC/DAI en Polygon Mainnet

## 🚀 Instalación

```bash
npm install
```

## 💻 Uso

### Desarrollo Local
```bash
npm start
# o
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción
```bash
npm run build
```
Los archivos compilados se generan en la carpeta `docs/`.

**Importante:** Antes de hacer build, actualiza el campo `homepage` en [`package.json`](package.json:13) con tu URL de producción.

## 🔧 Configuración

### Cambiar Red o Contrato

Edita [`src/Utils/index.js`](src/Utils/index.js:16-20):

```javascript
const Utils = {
    contract: "0xC76BeEf9Af888208820d7E7e84C3ec4B73a7e3A9", // Dirección del contrato
    rpc: "https://polygon-bor-rpc.publicnode.com",         // RPC de Polygon
    chainID: 137                                            // Chain ID (137 = Polygon Mainnet)
}
```

## 📝 Contratos Inteligentes

### Contrato Principal
- **Dirección:** `0xC76BeEf9Af888208820d7E7e84C3ec4B73a7e3A9`
- **Red:** Polygon Mainnet (Chain ID: 137)
- **Código:** [`contracts/USDT-Forsage-v2-poligon.sol`](contracts/USDT-Forsage-v2-poligon.sol)

### Tokens Soportados
- **USDT:** `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
- **USDC:** `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
- **DAI:** `0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063`

### Características del Contrato
- Sistema de matriz 3x15 (3 referidos por nivel, 15 niveles máximo)
- Precios por nivel: 20, 40, 80, 160... USDT (duplica cada nivel)
- Reinversión automática al completar matriz
- Sistema de referidos con comisiones directas

## 🌐 Funcionalidades

- ✅ Registro con referido
- ✅ Compra de niveles progresivos (1-15)
- ✅ Visualización de matriz y equipo
- ✅ Tracking de ganancias y pagos perdidos
- ✅ Link de referido personalizado
- ✅ Soporte multi-token (USDT/USDC/DAI)
- ✅ Integración con MetaMask

## 🔐 Funciones de Administrador

Solo el owner del contrato puede:
- Cambiar token principal (USDT/USDC/DAI)
- Modificar precios de niveles
- Retirar fondos perdidos

## 📱 Estructura del Proyecto

```
├── contracts/              # Contratos Solidity
├── src/
│   ├── assets/abi/        # ABIs de contratos
│   ├── pages/BackOffice/  # Interfaz principal
│   └── Utils/             # Configuración de red
├── public/                # Assets estáticos
└── docs/                  # Build de producción
```

## 🔄 Actualización

Para actualizar el proyecto:

1. **Actualizar dependencias:**
```bash
npm update
```

2. **Cambiar contrato:** Edita [`src/Utils/index.js`](src/Utils/index.js:16-20)

3. **Actualizar ABIs:** Reemplaza archivos en `src/assets/abi/`

4. **Rebuild:**
```bash
npm run build
```

## 🌍 Demo en Vivo

[https://themonopolyclub.com/](https://themonopolyclub.com/)

## 📄 Licencia

Apache 2.0

## ⚠️ Notas Importantes

- Requiere MetaMask instalado y configurado en Polygon
- Necesitas aprobar el token antes de registrarte o comprar niveles
- Los niveles deben comprarse secuencialmente (no puedes saltar niveles)
- Cada nivel cuesta el doble del anterior
- Las ganancias se reciben directamente en tu wallet

## 🛠️ Tecnologías

- React 16.14
- Web3.js 4.16
- Ethers.js 6.13
- Bootstrap 5.3
- Solidity 0.5.17
