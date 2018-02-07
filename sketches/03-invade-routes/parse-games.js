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

    var {gameId, generatedName, matchId, realm} = game
    var ticks = game.length
    var gameMeta = {gameId, generatedName, matchId, realm, ticks}

    var headers = 'x,y'

    p2full = game.map(d => d.playerStats[2])
    p7full = game.map(d => d.playerStats[7])

    p2Meta = p2full[0]
    p7Meta = p7full[0]

    var players = d3.range(1, 11).map(i => {
      var full = game.map(d => d.playerStats[i])

      var meta = full[0]

      return processPlayer(full)
    })

    p2 = processPlayer(p2full)
    p7 = processPlayer(p7full)

    function processPlayer(array){
      array.forEach((d, i)=> {
      })

      console.log(array.length)

      var cols = headers.split(',')

      return array
        .filter((d, i) => i < 150)
        .map(d => cols.map(str => d[str]).join(','))
        .join(' ')
    }


    return {players, headers, gameMeta}
  })


games = games.filter(d => d.gameMeta.ticks > 100)
io.writeDataSync(__dirname + '/routes.json', games)