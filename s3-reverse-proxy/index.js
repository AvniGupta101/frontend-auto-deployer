const express = require('express')
const httpProxy = require('http-proxy')

const app = express()
const PORT = 8000

// ✅ Correct S3 HTTP URL (not s3://)
const BASE_PATH = 'https://vercel-project-avni.s3.eu-north-1.amazonaws.com'

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostname = req.hostname
    const subdomain = hostname.split('.')[0]

    // build correct path
    const resolvesTo = `${BASE_PATH}/__outputs/${subdomain}`

    console.log("Proxying to:", resolvesTo)

    return proxy.web(req, res, {
        target: resolvesTo,
        changeOrigin: true
    })
})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url

    if (url === '/') {
        proxyReq.path += 'index.html'
    }
    
})

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`))