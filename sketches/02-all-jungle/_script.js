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
    .transition().duration(0).delay(d => d.i*100)
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

  // drawPathHealth(game.p2, 'rgba(255,0,255,1)')
  // drawPathHealth(game.p7, 'rgba(0,0,0,1)')
  function drawPathHealth(path, color){
    var colorScale = d3.scaleLinear()
      .domain([0, .5, 1])
      .range(['red', 'orange', 'green'])
    
    path.forEach(d => {
      ctx.beginPath()
      ctx.moveTo(c.x(d.p.x), c.y(d.p.y))
      ctx.lineTo(c.x(d.x),   c.y(d.y))
      ctx.strokeStyle = colorScale(d.percentHealth)
      ctx.lineWidth = d.percentHealth*3 + .1
      ctx.stroke()
    })
  }

  // drawPathWidth(game.p2, 'rgba(255,0,255,1)')
  // drawPathWidth(game.p7, 'rgba(0,0,0,1)')
  function drawPathWidth(path, color){
    path.forEach(d => {
      ctx.beginPath()
      ctx.moveTo(c.x(d.p.x), c.y(d.p.y))
      ctx.lineTo(c.x(d.x),   c.y(d.y))
      ctx.strokeStyle = color
      ctx.lineWidth = d.percentHealth*3 + .1
      ctx.stroke()
    })
  }

  // drawPathTime(game.p2, 'steelblue')
  // drawPathTime(game.p7, 'green')
  function drawPathTime(path, color){
    var colorScale = d3.scaleLinear()
      .domain([0, 1])
      .range(['red', color])

    path.forEach((d, i) => {
      ctx.beginPath()
      ctx.moveTo(c.x(d.p.x), c.y(d.p.y))
      ctx.lineTo(c.x(d.x),   c.y(d.y))
      ctx.strokeStyle = color
      ctx.strokeStyle = colorScale(d.percentHealth)

      ctx.lineWidth = .5 + i/100
      ctx.stroke()
    })
  }

  drawPathTimeSVG(game.p2, 'steelblue')
  drawPathTimeSVG(game.p7, 'green')
  function drawPathTimeSVG(path, color){
    var colorScale = d3.scaleLinear()
      .domain([0, 1])
      .range(['red', color])

    path.forEach((d, i) => {
      c.svg.append('path.jungle')
        .at({
          d: [
            'M', c.x(d.p.x), c.y(d.p.y),
            'L', c.x(d.x),   c.y(d.y)
          ].join(' '),
          stroke: color,
          stroke: colorScale(d.percentHealth),
          strokeWidth: .5 + i/100
        })
        .datum(d)
    })
  }


}

