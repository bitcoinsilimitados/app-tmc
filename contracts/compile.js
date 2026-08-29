const path = require('path');
const fs = require('fs');
const https = require('https');
const solc = require('solc');

// ============================================================
// CONFIGURACION UNICA - Cambia SOLO estos 2 valores
// (También puedes pasarlos como argumentos:
//  node contracts/compile.js <archivo.sol> <version>)
// ============================================================
const CONTRACT_FILE = 'system-tmc-v3-polygon.sol'; // Archivo dentro de contracts/
const SOLC_VERSION = '0.5.17'; // Version de Solidity (ej: 0.5.17, 0.8.24, 0.4.26...)
// ============================================================

const FILE = process.argv[2] || CONTRACT_FILE;
const VERSION = process.argv[3] || SOLC_VERSION;

const CONTRACTS_DIR = __dirname;
const ABI_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'abi');

function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} al descargar ${url}`));
                res.resume();
                return;
            }
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

function getCompiler() {
    const installed = solc.version();
    const installedShort = installed.split('+')[0];
    if (installedShort === VERSION) {
        console.log(`\nUsando solc instalado: ${installed}\n`);
        return Promise.resolve(solc);
    }
    console.log(`\nBuscando solc ${VERSION} en solc-bin...\n`);
    return httpGet('https://binaries.soliditylang.org/bin/list.json')
        .then((list) => {
            const build = list.builds
                .filter((b) => b.version === VERSION)
                .sort((a, b) => (a.build < b.build ? 1 : -1))[0];
            if (!build) {
                throw new Error(`Version ${VERSION} no encontrada en solc-bin`);
            }
            return new Promise((resolve, reject) => {
                solc.loadRemoteVersion(build.longVersion, (err, remoteSolc) => {
                    if (err) return reject(err);
                    console.log(`Descargado solc remoto: ${build.longVersion}\n`);
                    resolve(remoteSolc);
                });
            });
        });
}

function detectContracts(source) {
    const contracts = [...source.matchAll(/(?:abstract\s+)?contract\s+([A-Za-z_$][A-Za-z0-9_$]*)/g)].map((m) => m[1]);
    const interfaces = [...source.matchAll(/interface\s+([A-Za-z_$][A-Za-z0-9_$]*)/g)].map((m) => m[1]);
    return contracts.filter((name) => !interfaces.includes(name));
}

async function main() {
    const contractPath = path.join(CONTRACTS_DIR, FILE);
    if (!fs.existsSync(contractPath)) {
        console.error(`\n✗ No existe el archivo: ${FILE} en ${CONTRACTS_DIR}`);
        process.exit(1);
    }

    const source = fs.readFileSync(contractPath, 'utf8');
    const detected = detectContracts(source);
    if (detected.length === 0) {
        console.error('\n✗ No se encontró ningún contrato en el archivo');
        process.exit(1);
    }
    console.log(`Archivo: ${FILE}`);
    console.log(`Contratos detectados: ${detected.join(', ')}`);

    const compiler = await getCompiler();
    const input = {
        language: 'Solidity',
        sources: {
            [FILE]: { content: source }
        },
        settings: {
            outputSelection: {
                '*': { '*': ['abi'] }
            }
        }
    };

    console.log('Compilando...');
    const output = JSON.parse(compiler.compile(JSON.stringify(input)));

    const errors = (output.errors || []).filter((e) => e.severity === 'error');
    if (errors.length) {
        console.error('\n✗ Errores de compilación:');
        errors.forEach((e) => console.error(e.formattedMessage));
        process.exit(1);
    }

    const warnings = (output.errors || []).filter((e) => e.severity === 'warning');
    if (warnings.length) {
        console.log(`\n⚠ ${warnings.length} advertencia(s):`);
        warnings.slice(0, 5).forEach((w) => console.error(w.formattedMessage));
    }

    const sourceOutput = output.contracts[FILE] || {};
    const contractNames = Object.keys(sourceOutput).filter((name) => detected.includes(name));
    if (contractNames.length === 0) {
        console.error('\n✗ No se generó ABI para ningún contrato');
        process.exit(1);
    }

    if (!fs.existsSync(ABI_DIR)) fs.mkdirSync(ABI_DIR, { recursive: true });

    for (const name of contractNames) {
        const abi = sourceOutput[name].abi;

        const jsonPath = path.join(CONTRACTS_DIR, `${name}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(abi, null, 2));

        const jsPath = path.join(ABI_DIR, `${name}.js`);
        const jsContent = `const abi = ${JSON.stringify(abi, null, 2)};\n\nexport default abi;\n`;
        fs.writeFileSync(jsPath, jsContent);

        console.log(`\n✓ ${name} (${abi.length} entradas):`);
        console.log(`  JSON: ${path.relative(process.cwd(), jsonPath)}`);
        console.log(`  JS  : ${path.relative(process.cwd(), jsPath)}`);
    }

    console.log('\n✓ Compilación exitosa.');
}

main().catch((e) => {
    console.error('\n✗ Ocurrió un error inesperado:', e.message);
    process.exit(1);
});
