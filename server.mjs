import { createServer } from 'node:http'
import { Readable } from 'node:stream'

const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 3000)

const { default: app } = await import('./dist/server/server.js')

function toWebRequest(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const authority = req.headers.host || `${host}:${port}`
  const url = new URL(req.url || '/', `${protocol}://${authority}`)
  const headers = new Headers()

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item)
    } else if (value !== undefined) {
      headers.set(key, value)
    }
  }

  const isBodylessMethod = req.method === 'GET' || req.method === 'HEAD'

  return new Request(url, {
    method: req.method,
    headers,
    body: isBodylessMethod ? undefined : Readable.toWeb(req),
    duplex: isBodylessMethod ? undefined : 'half',
  })
}

const server = createServer(async (req, res) => {
  try {
    const request = toWebRequest(req)
    const response = await app.fetch(request)

    res.statusCode = response.status
    res.statusMessage = response.statusText

    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    if (!response.body) {
      res.end()
      return
    }

    Readable.fromWeb(response.body).pipe(res)
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('content-type', 'text/plain; charset=utf-8')
    res.end('Internal Server Error')
  }
})

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
