

require('dotenv').config()

const express = require('express')
const http = require('http')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const Redis = require('ioredis')

const app = express()
const PORT = 9000
console.log("Redis URL:", process.env.REDIS_URL)
console.log("AWS KEY:", process.env.AWS_ACCESS_KEY_ID)
console.log("AWS SECRET:", process.env.AWS_SECRET_ACCESS_KEY)
// 🔥 Create HTTP server
const server = http.createServer(app)

// 🔥 Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})


const subscriber = new Redis(process.env.REDIS_URL)

const ecsClient = new ECSClient({
   region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const config = {
    CLUSTER: 'arn:aws:ecs:eu-north-1:088167543829:cluster/builder-cluster-vercel',
    TASK: 'builder-task-3'
}


// 🔥 Socket connection
io.on('connection', socket => {
    console.log('Client connected')

    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

app.use(express.json())

// 🔥 API route
app.post('/project', async (req, res) => {
    try {
        const { gitURL, slug } = req.body
        const projectSlug = slug ? slug : generateSlug()

        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: [
                        'subnet-0c5b8ef1cfb45160b',
                        'subnet-0d0c5d4b652551f94',
                        'subnet-0e819e9a56e7cf2dd'
                    ],
                    securityGroups: ['sg-016f2e416960e0a3e']
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: 'builder-image-2', // ✅ make sure this matches ECS
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitURL },
                            { name: 'PROJECT_ID', value: projectSlug }
                        ]
                    }
                ]
            }
        })

        await ecsClient.send(command)

        return res.json({
            status: 'queued',
            data: {
                projectSlug,
                url: `http://localhost:8000/${projectSlug}` // ✅ fixed for local
            }
        })

    } catch (err) {
        console.error("ERROR:", err)
        return res.status(500).json({ error: err.message })
    }
})

// 🔥 Redis → Socket bridge
async function initRedisSubscribe() {
    console.log('Subscribed to logs....')

    subscriber.psubscribe('logs:*')

    subscriber.on('pmessage', (pattern, channel, message) => {
        console.log(channel, message)

        io.to(channel).emit('message', message)
    })
}

initRedisSubscribe()

// 🔥 Start server
server.listen(PORT, () => {
    console.log(`API + Socket running on ${PORT}`)
})