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

    var headers = 'x,y,h,maxHealth'

    p2full = game.map(d => d.playerStats[2])
    p7full = game.map(d => d.playerStats[7])

    p2Meta = p2full[0]
    p7Meta = p7full[0]

    p2 = processPlayer(p2full)
    p7 = processPlayer(p7full)

    function processPlayer(array){
      var firstBack = 0
      array.forEach((d, i)=> {
        d.p = i ? array[i - 1] : d
        d.i = i

        var dx = d.x - d.p.x
        var dy = d.y - d.p.y
        
        if (Math.sqrt(dx*dx + dy*dy) > 3000 && !firstBack) firstBack = i - 1

        delete d.p
        delete d.i
      })

      console.log(firstBack, array.length)

      var cols = headers.split(',')

      return array
        .filter((d, i) => i < firstBack)
        .map(d => cols.map(str => d[str]).join(','))
        .join(' ')
    }

    // console.log(p2)


    return {p2, p7, headers, gameMeta, p2Meta, p7Meta}
  })


games = games.filter(d => d.gameMeta.ticks > 100)
io.writeDataSync(__dirname + '/jungle-routes.json', games)