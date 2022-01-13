const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://172.26.0.2:27017/jara?replicaSet=rs0&readPreference=primary')
    console.log('conhectou ao mongoose')
}

main().catch((err) => console.log(err))

module.exports = mongoose