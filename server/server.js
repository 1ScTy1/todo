import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const Root = () => ''
const { readFile, writeFile, unlink } = require('fs').promises
const { readdirSync } = require('fs')
const shortid = require('shortid')

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const filtered = (task) => {
  return task.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, status: rec.status, title: rec.title }]
  }, [])
}

const read = (category) => {
  return readFile(`${__dirname}/task/${category}.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(() => [])
}

const write = (category, task) => {
  writeFile(`${__dirname}/task/${category}.json`, JSON.stringify(task), { encoding: 'utf8' })
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  try {
    const { category } = req.params
    const tasks = filtered(await read(category))
    res.json(tasks)
  } catch (e) {
    console.log(e)
  }
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  try {
    const { category, timespan } = req.params
    const tasks = await read(category)
    const periodOfTime = {
      day: 1000 * 60 * 60 * 24,
      week: 7 * 1000 * 60 * 60 * 24,
      month: 30 * 1000 * 60 * 60 * 24,
      all: 1 / 0
    }
    const result = filtered(
      // eslint-disable-next-line no-underscore-dangle
      tasks.filter((el) => el._createdAt + periodOfTime[timespan] > +new Date())
    )
    res.json(result)
  } catch (e) {
    console.log(e)
  }
})

server.get('/api/v1/categories', (req, res) => {
  const category = readdirSync(`${__dirname}/task`).map((el) => el.split('.json').join(''))
  res.json(category)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  if (!Object.keys(req.body).length) {
    await write(category, [])
    res.json({ status: 'created' })
  } else {
    const tasks = await read(category)
    const newTask = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const task = [...tasks, newTask]
    await write(category, task)
    res.json({ status: 'updated', newTask })
  }
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await read(category)
  const statuses = ['done', 'new', 'in progress', 'blocked']
  if (statuses.includes(req.body.status) || req.body.title !== undefined) {
    const updated = tasks.map((el) => (el.taskId === id ? { ...el, ...req.body } : el))
    await write(category, updated)
    res.json({ status: 'success' })
  } else {
    res.status(501)
    res.json({ status: 'error' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await read(category)
  const deletedTask = tasks.map((el) => (el.taskId === id ? { ...el, _isDeleted: true } : el))
  await write(category, deletedTask)
  res.json({ status: 'deleted' })
})

server.delete('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  await unlink(`${__dirname}/task/${category}.json`)
  res.json({ status: 'deleted' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'yourproject - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
