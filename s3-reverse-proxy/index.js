
// const express = require('express')
// const httpProxy = require('http-proxy')

// const app = express()
// const PORT = 8000


// const BASE_PATH = 'https://vercel-project-avni.s3.eu-north-1.amazonaws.com'

// const proxy = httpProxy.createProxy()

// app.use((req, res) => {
//     if (
//     req.url.startsWith('/.well-known') ||
//     req.url.startsWith('/favicon.ico')
// ) {
//     return res.status(204).end()
// }
//     console.log("Incoming URL:", req.url)

//     const parts = req.url.split('/')
//     const slug = parts[1]

//     if (!slug) {
//         return res.status(404).send('No project specified')
//     }

//     let path

//     // 🔥 CRITICAL FIX
//     if (req.url === `/${slug}` || req.url === `/${slug}/`) {
//         path = '/index.html'
//     } else {
//         path = req.url.replace(`/${slug}`, '')
//     }

//     const finalPath = `/__outputs/${slug}${path}`

//     console.log("Final Path Sent to S3:", finalPath)

//     req.url = finalPath

//     proxy.web(req, res, {
//         target: BASE_PATH,
//         changeOrigin: true
//     })
// })

// proxy.on('error', (err, req, res) => {
//     console.error('Proxy Error:', err.message)
//     res.status(500).send('Proxy Error')
// })

// app.listen(PORT, () => {
//     console.log(`🚀 Running on http://localhost:${PORT}`)
// })
const express = require('express')
const httpProxy = require('http-proxy')

const app = express()
const PORT = 8000

const BASE_PATH = 'https://vercel-project-avni.s3.eu-north-1.amazonaws.com'

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    console.log("Incoming URL:", req.url)

    // ignore system routes
    if (
        req.url.startsWith('/.well-known') ||
        req.url.startsWith('/favicon.ico')
    ) {
        return res.status(204).end()
    }

    const parts = req.url.split('/')
    let slug = parts[1]

    // 🔥 HANDLE ASSETS WITHOUT SLUG
    if (req.url.startsWith('/assets')) {
        // assume last accessed project (quick fix)
        slug = req.headers.referer?.split('/')[3]

        console.log("Recovered slug from referer:", slug)
    }

    if (!slug) {
        return res.status(404).send("No project specified")
    }

    let path

    if (req.url === `/${slug}` || req.url === `/${slug}/`) {
        path = '/index.html'
    } else {
        path = req.url.replace(`/${slug}`, '')
    }

    // 🔥 IF assets request
    if (req.url.startsWith('/assets')) {
        path = req.url
    }

    const finalPath = `/__outputs/${slug}${path}`

    console.log("Final Path:", finalPath)

    req.url = finalPath
    req.headers.host = 'vercel-project-avni.s3.eu-north-1.amazonaws.com'

    proxy.web(req, res, {
        target: BASE_PATH,
        changeOrigin: true
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`)
})