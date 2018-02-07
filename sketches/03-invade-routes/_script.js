console.clear()
d3.select('body').selectAppend('div.tooltip')


//TRLH3-1002350252.json
d3.loadData('routes.json', (err, res) => {
  games = res[0]

  games.forEach(game => {
    var {headers, players} = game

    headers = headers.split(',')
    game.players = game.players.map(parsePath)

    function parsePath(p){
      var outPath = p.split(' ').map(str => {
        var rv = {}
        str.split(',').forEach((d, i) => rv[headers[i]] = d)

        return rv
      })

      outPath.forEach((d, i) => {
        d.p = i ? outPath[i - 1] : d
        d.i = i

        d.percentHealth = d.h/d.maxHealth        
      })

      return outPath
    }
  })

  gameSel = d3.select('#graph').html('')
    .appendMany('div', games)
    .st({height: 150, width: 150, display: 'inline-block'})
    .each(drawGame)


  var jungleSel = d3.selectAll('.jungle')
    .st({opacity: 0})
    .transition().duration(0).delay(d => d.i*200)
    .st({opacity: 1})
})


function drawGame(game){
  c = d3.conventions({
    sel: d3.select(this),
    layers: 'dcs',
    margin: {top: 0, left: 0, right: 0, bottom: 0}
  })

  var {x, y, layers: [divSel, ctx, svg]} = c

  var o = 200
  x.domain([0 + o, 15000 - o])
  y.domain([0 + o, 15000 - o])


  game.players.forEach(drawPathTimeSVG)
  function drawPathTimeSVG(path, i){
    var color = i < 5 ? 'steelblue' : '#f0f'

    path.forEach((d, i) => {
      c.svg.append('path.jungle')
        .at({
          d: [
            'M', c.x(d.p.x), c.y(d.p.y),
            'L', c.x(d.x),   c.y(d.y)
          ].join(' '),
          stroke: color,
          strokeWidth: .5
        })
        .datum(d)
    })
  }


}

