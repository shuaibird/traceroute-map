require('dotenv').config()

const fs = require('fs')
const path = require('path')

const trace = require('./trace')

const [host] = process.argv.slice(2)

if (!host) {
  throw Error('usage: node index.js [HOST]')
}

const templateFile = path.join(__dirname, 'template.html')
const outputFile = path.join(__dirname, 'map.html')

trace({
  host,
  apiKey: process.env.IPAPI_API_KEY,
  cb(data) {
    const coordinates = data
      .map(({ latitude, longitude, city, continent_name, country_name }) => (
        {
          lat: latitude,
          lng: longitude,
          city,
          country: country_name,
          continent: continent_name,
        }
      ))
      .reduce((acc, cur) => {
        const existed = acc.some(({ lat, lng }) => cur.lat === lat && cur.lng === lng)
        if (existed) {
          return acc
        } else {
          return [
            ...acc,
            cur,
          ]
        }
      }, [])

    const { GOOGLE_API_KEY: apiKey } = process.env

    fs.readFile(templateFile, (err, template) => {
      const output = template
        .toString()
        .replace('{{COORDINATES}}', JSON.stringify(coordinates))
        .replace('{{GOOGLE_API_KEY}}', apiKey)

      fs.writeFile(outputFile, output, () => {
      })
    })
  },
})
