const concatBuffer = (process, cb) => {
  let result = ''

  process.stdout.on('data', (data) => {
    result += data.toString()
  })

  process.on('close', () => {
    cb(result)
  })
}

module.exports = {
  concatBuffer,
}
