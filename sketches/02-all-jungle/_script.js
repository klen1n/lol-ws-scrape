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
      var outPath = p.split(' ').map(str => {
        var rv = {}
        str.split(',').forEach((d, i) => rv[headers[i]] = d)

        return rv
      })

      outPath.forEach((d, i) => {
        d.p = i ? outPath[i - 1] : i

        d.percentHealth = d.h/d.maxHealth        
      })

      return outPath
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

  var o = 200
  x.domain([0 + o, 15000 - o])
  y.domain([0 + o, 15000 - o])

  // drawPathMono()
  function drawPathMono(){
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

  drawPathHealth(game.p2)
  drawPathHealth(game.p7)

  function drawPathHealth(path){
    var color = d3.scaleLinear().range(['red', 'green'])

    path.forEach(d => {
      ctx.beginPath()
      ctx.moveTo(c.x(d.p.x), c.y(d.p.y))
      ctx.lineTo(c.x(d.x),   c.y(d.y))
      ctx.strokeStyle = color(d.percentHealth)
      ctx.lineWidth = 2
      ctx.stroke()
    })

    window.ctx = ctx
  }


}

