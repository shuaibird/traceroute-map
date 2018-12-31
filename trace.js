const { spawn } = require('child_process')
const { concatBuffer, isIpPrivate } = require('./utils')

const trace = ({ apiKey, host, cb }) => {
  const IpLookup = require('./ip-lookup')
  const ipLookup = new IpLookup(apiKey)

  const traceroute = spawn('traceroute', [host])

  concatBuffer(traceroute, async (list) => {
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
      .filter((ip) => !isIpPrivate(ip))

    const data = await Promise.all(routers.map(async (router) => await ipLookup.lookup(router)))
    cb(data)
  })
}

module.exports = trace
