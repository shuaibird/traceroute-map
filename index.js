require('dotenv').config()

const { spawn } = require('child_process')
const { concatBuffer } = require('./utils')

const IpLookup = require('./ip-lookup')
const ipLookup = new IpLookup(process.env.API_ACCESS_KEY)

const [destination] = process.argv.slice(2)

if (!destination) {
  throw Error('usage: node traceroute.js [HOST]')
}

const main = spawn('traceroute', [destination])

concatBuffer(main, async (list) => {
  const routers = list.trim().split('\n')
    .map((line) => {
      const matched = line.match(/\((\d{1,3}\.){3}\d{1,3}\)/)
      if (matched) {
        const ip = matched[0]
        return ip.slice(1, ip.length - 1)
      } else {
        return ''
      }
    })
    .filter((ip) => !!ip)

  const data = await Promise.all(routers.map(async (router) => await ipLookup.lookup(router)))
  console.log(data)
})
