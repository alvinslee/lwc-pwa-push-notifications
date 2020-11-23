const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const webPush = require('web-push')
const cors = require('cors')
const fs = require('fs')
const app = express()
require('dotenv').config()

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env
const SUBSCRIPTION_FILE_PATH = './subscriptions.json'
const INTERVALS = {}
const PUSH_TYPES = {
  iss: {
    description: 'International Space Station geolocation',
    url: 'http://api.open-notify.org/iss-now.json',
    responseToText: ({ iss_position }) => {
      return `Current position of the International Space Station: ${iss_position.latitude} (lat), ${iss_position.longitude} (long)`
    }
  },
  activity: {
    description: 'Suggestion for an activity',
    url: 'http://www.boredapi.com/api/activity',
    responseToText: ({ type, activity }) => {
      return `${activity} (${type})`
    }
  },
  quote: {
    description: 'Random software development quote',
    url: 'http://quotes.stormconsultancy.co.uk/random.json',
    responseToText: ({ author, quote }) => {
      return `${quote} (${author})`
    }
  }
}

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.log('VAPID public/private keys must be set')
  return
}

webPush.setVapidDetails(
  'mailto:REPLACE WITH YOUR EMAIL',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

const readSubscriptions = () => {
  try {
    return JSON.parse(fs.readFileSync(SUBSCRIPTION_FILE_PATH))
  } catch(_) {}
  return {}
}

const writeSubscriptions = (subscriptions = {}) => {
  try {
    fs.writeFileSync(SUBSCRIPTION_FILE_PATH, JSON.stringify(subscriptions))
  } catch (_) {
    console.log('Could not write')
  }
}

const fetchPayload = async (pushType) => {
  const obj = PUSH_TYPES[pushType]
  if (obj) {
    const response = await fetch(obj.url)
    return obj.responseToText(await response.json())
  } else {
    return 'Could not retrieve payload'
  }
}

const sendNotification = async ({ subscription, pushType }) => {
  webPush.sendNotification(subscription, await fetchPayload(pushType))
}

const startNotificationInterval = ({ subscription, pushType, duration }) => {
  INTERVALS[subscription.endpoint] = setInterval(
    async () => { sendNotification({ subscription, pushType }) },
    duration * 1000
  )
}

const initializeNotifications = () => {
  const subscriptions = readSubscriptions()
  Object.keys(subscriptions).forEach(key => startNotificationInterval(subscriptions[key]))
}

app
  .use(cors({
    origin: ['http://localhost:3001', 'REPLACE WITH HEROKU CLIENT APP URL'],
    optionsSuccessStatus: 200
  }))
  .get('/vapidPublicKey', (_, res) => {
    res.send(VAPID_PUBLIC_KEY)
  })
  .use(bodyParser.json())
  .post('/subscribe', (req, res) => {
    const { subscription, pushType = 'iss', duration = 30 } = req.body
    const subscriptions = readSubscriptions()
    subscriptions[subscription.endpoint] = { subscription, pushType, duration }
    writeSubscriptions(subscriptions)
    webPush.sendNotification(subscription, `OK! You'll receive a "${PUSH_TYPES[pushType].description}" notification every ${duration} seconds.`)
    startNotificationInterval({ subscription, pushType, duration })
    res.status(201).send('Subscribe OK')
  })
  .post('/unsubscribe', (req, res) => {
    const subscriptions = readSubscriptions()
    delete subscriptions[req.body.subscription.endpoint]
    clearInterval(INTERVALS[req.body.subscription.endpoint])
    writeSubscriptions(subscriptions)
    res.status(201).send('Unsubscribe OK')
  })


app.listen(process.env.PORT || 3000, async () => {
  initializeNotifications()
})
