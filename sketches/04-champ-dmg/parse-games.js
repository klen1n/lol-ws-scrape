var {_, d3, jp, fs, glob, io, queue, request} = require('scrape-stl')


console.log(__dirname + '/../remote-games/*.json')
var games = glob.sync(__dirname + '/../../remote-games/*.json')
  .filter(d => !d.includes('.finished'))
  .map(path => {
    console.log(path)

    var str = fs.readFileSync(path, 'utf8')
    if (_.last(str.trim()) != ']') {
      str = str.replace(/,\s*$/, '') + ']'
    }
    game = JSON.parse(str)

    var {gameId, generatedName, matchId, realm} = game[0]
    console.log(generatedName)
    var ticks = game.length
    var gameMeta = {gameId, generatedName, matchId, realm, ticks}

    var headers = 'mk,tg,cg,tdc,h,maxHealth'

    var players = d3.range(1, 11).map(i => {

      var full = game.map(d => d.playerStats[i])

      var meta = full[0]

      return {ticks: processPlayer(full), meta}
    })

    var secPerTick = 5

    function processPlayer(array){
      var cols = headers.split(',')

      return array
        .filter((d, i) => i % 5 == 0)
        .map(d => cols.map(str => d[str]).join(','))
        .join(' ')
    }


    return {players, headers, gameMeta, secPerTick}
  })


games = games.filter(d => d.gameMeta.ticks > 100)
io.writeDataSync(__dirname + '/games.json', games)