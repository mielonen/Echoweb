//Echoweb
//
// get_all_ipv4 - palauttaa palvelimen ip-osoitteen, jossa ohjelma on suorituksessa
// proxy - ohjaa kyselyn RECEIVER_SERVICE_URL määrityksen mukaisesti get_all_ipv4 rajapintaan

const express = require('express');
const os = require('os');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;
const RECEIVER_SERVICE_URL = process.env.RECEIVER_SERVICE_URL;

if (!RECEIVER_SERVICE_URL) {
    console.error('RECEIVER_SERVICE_URL ei ole määritelty.');
    process.exit(1);
}

const proxyOptions = {
    target: RECEIVER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '/get_all_ipv4',
    },
};

app.get('/get_all_ipv4', (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    const ipv4Addresses = [];

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4') {
                ipv4Addresses.push({ interface: interfaceName, address: iface.address });
            }
        }
    }
    console.log(ipv4Addresses);
    res.json(ipv4Addresses);
});

app.use('/proxy', createProxyMiddleware(proxyOptions));

app.listen(port, () => {
    console.log(`Palvelin kuuntelee porttia ${port}`);
});
