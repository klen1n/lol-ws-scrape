console.clear()
d3.select('body').selectAppend('div.tooltip')

// mk tg cg tdc h maxHealth
var isTotalGold = false
d3.loadData('../04-champ-dmg/games.json', (err, res) => {
  games = res[0]

  games.forEach(game => {
    var {headers, players} = game

    headers = headers.split(',')
    game.players = game.players.map(parsePath)

    function parsePath(p){
      var outPath = p.ticks.split(' ').map(str => {
        var rv = {}
        str.split(',').forEach((d, i) => rv[headers[i]] = d)

        return rv
      })

      outPath.forEach((d, i) => {
        d.p = i ? outPath[i - 1] : d
        d.n = i != outPath.length - 1 ? outPath[i + 1] : d
        d.i = i

        d.time = i*5 + 10
        d.percentHealth = d.h/d.maxHealth        
      })

      outPath.meta = p.meta

      outPath.name = p.meta.summonerName

      return outPath
    }
  })

  gameSel = d3.select('#graph').html('')
    .appendMany('div', games)
    .st({height: 300})
    .each(drawGame)
})


function drawGame(game){
  var c = d3.conventions({
    sel: d3.select(this),
    layers: 'dcs',
    margin: {top: 0, left: 35, right: 0, bottom: 60}
  })

  var {x, y, layers: [divSel, ctx, svg]} = c

  var maxHeight = c.height/10
  x.domain([0, 60*70])
  y.domain([1, 0]).range([0, maxHeight - 1])


  c.xAxis
    .tickFormat(d => d/60 + (d == 60*50 ? ' ' : ''))
    .tickValues(d3.range(0, 60*70, 60*10))

  c.yAxis.tickValues([])


  // d3.drawAxis(c)

  var area = d3.area()
    .x((d, i) =>  c.x(i*5 + 10))
    .y0(d => c.y(d.percentHealth))
    .y1(d => c.y(0))
    .curve(d3.curveStep)

  var deathArea = d3.area()
    .x((d, i) =>  c.x(i*5 + 10))
    .y0(d => c.y(1))
    .y1(d => c.y(0))
    // .curve(d3.curveStep)
    .defined(d => d.h == 0 || d.p.h == 0 || d.n.h == 0)

  var playerSel = svg.appendMany('g', game.players)
    .translate((d, i) => maxHeight*i, 1)

  playerSel.append('rect')
    .at({
      x: 3,
      width: c.x(game.players[0].length*5 + 10) - 4, 
      height: maxHeight - 1, 
      y: c.y(1),
      fill: '#555'
    })

  playerSel.append('path.area')
    .at({
      d: deathArea,
      fill: '#000',
    })

  playerSel.append('path.area')
    .at({
      d: area,
      fill: (d, i) => i < 5 ? 'rgb(33, 150, 243)' : 'rgb(244, 67, 54)'
    })

  playerSel.append('text')
    .text(d => d.name)
    .translate(d => maxHeight, 1)
    .at({dx: 5, dy: -3, fontSize: 10, fill: '#fff'})



}

