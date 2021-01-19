const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri, dbname) {
    this.uri = uri
    this.dbname = dbname
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.client.db(dbname)
  },

  async disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },

  async getDb () {
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri, this.dbname)
    }
    return this.db
  }
}
