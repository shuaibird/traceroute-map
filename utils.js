const concatBuffer = (process, cb) => {
  let result = ''

  process.stdout.on('data', (data) => {
    result += data.toString()
  })

  process.on('close', () => {
    cb(result)
  })
}

const isIpPrivate = (ip) => {
  if (!/(\d{1,3}\.){3}\d{1,3}/.test(ip)) {
    throw Error('The ip is invalid')
  }

  const [first, second] = ip.split('.').map((str) => +str)
  const groupA = first === 192 && second === 168
  const groupB = first === 172 && second >= 16 && second <= 31
  const groupC = first === 10
  return groupA || groupB || groupC
}

module.exports = {
  concatBuffer,
  isIpPrivate,
}
