const fetch = require('node-fetch')

class IpLookup {
  static get apiEndpoint() {
    return 'http://api.ipapi.com'
  }

  constructor(apiKey) {
    this._apiKey = apiKey
  }
  
  _constructUrl(ip) {
    return `${IpLookup.apiEndpoint}/${ip}?access_key=${this._apiKey}`
  }

  async lookup(ip) {
    const res = await fetch(this._constructUrl(ip))
    const data = await res.json()
    return data
  }
}

module.exports = IpLookup
