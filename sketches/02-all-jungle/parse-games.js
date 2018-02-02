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

    p2 = game.map(d => d.playerStats[2])
    p7 = game.map(d => d.playerStats[7])

    p2Meta = p2[0]
    p7Meta = p7[0]
    var {gameId, generatedName, matchId, realm} = game
    var ticks = game.length
    var gameMeta = {gameId, generatedName, matchId, realm, ticks}

    var headers = 'x,y,h,maxHealth'

    p2 = processPlayer(p2)
    p7 = processPlayer(p7)

    function processPlayer(array){
      array = array.map(d => ({x: d.x, y: d.y}))

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

      array = array.filter((d, i) => i < firstBack)
      return array
        .map(d => headers.split(',').map(str => d[str]).join(','))
        .join(' ')
    }


    return {p2, p7, headers, gameMeta, p2Meta, p7Meta}
  })


games = games.filter(d => d.gameMeta.ticks > 100)
io.writeDataSync(__dirname + '/jungle-routes.json', games)