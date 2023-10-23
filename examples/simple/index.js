import Desktopy from './../../exports/desktopy.js'

const app = await new Desktopy({autoStart: false})
// console.log(app);


await app.open(app.url)

// desktopy.start()