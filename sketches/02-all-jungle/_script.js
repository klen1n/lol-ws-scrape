console.clear()
d3.select('body').selectAppend('div.tooltip')


//TRLH3-1002350252.json
d3.loadData('jungle-routes.json', (err, res) => {
  games = res[0]

  games.forEach(game => {
    var {headers, p2, p7} = game

    headers = headers.split(',')
    game.p2 = parsePath(game.p2)
    game.p7 = parsePath(game.p7)

    function parsePath(p){
      return p.split(' ').map(str => {
        var rv = {}
        str.split(',').forEach((d, i) => rv[headers[i]] = d)

        return rv
      })
    }
  })

  gameSel = d3.select('#graph').html('')
    .appendMany('div', games)
    .st({height: 250, width: 250, display: 'inline-block'})
    .each(drawGame)
})


function drawGame(game){
  c = d3.conventions({
    sel: d3.select(this),
    layers: 'dcs',
    margin: {top: 0, left: 0, right: 0, bottom: 0}
  })

  var {x, y, layers: [divSel, ctx, svg]} = c

  var c = 200
  x.domain([0 + c, 15000 - c])
  y.domain([0 + c, 15000 - c])

  var line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y))


  ctx.strokeStyle = '#000'
  line.context(ctx)(game.p2)
  ctx.stroke()

  ctx.strokeStyle = '#f0f'
  ctx.beginPath()
  line.context(ctx)(game.p7)
  ctx.stroke()

}

