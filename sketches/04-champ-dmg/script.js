console.clear()
d3.select('body').selectAppend('div.tooltip')

// mk tg cg tdc h maxHealth

d3.loadData('games.json', (err, res) => {
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

      // outPath.str = p
      // throw 'up'

      outPath.forEach((d, i) => {
        // d.p = i ? outPath[i - 1] : d
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
    .st({height: 200, width: 200, display: 'inline-block'})
    .each(drawGame)

})


function drawGame(game){
  var sel = d3.select(this)
  sel.append('h4')
    .text(game.gameMeta.generatedName.split('|G1')[0].replace('|', ' v. '))
    .st({fontSize: 14, textAlign: '', marginBottom: 10, marginTop: 20})

  c = d3.conventions({
    sel: d3.select(this),
    layers: 'dcs',
    margin: {top: 0, left: 25, right: 0, bottom: 60}
  })

  var {x, y, layers: [divSel, ctx, svg]} = c

  x.domain([0, 60*70])
  y.domain([0, 50000])

  c.xAxis.ticks(5)
    .tickFormat(d => d/60 + (d == 60*50 ? ' ' : ''))
    .tickValues(d3.range(0, 60*70, 60*10))

  c.yAxis.ticks(5)
    .tickFormat(d => d/1000 + 'k')

  d3.drawAxis(c)


  var line = d3.line()
    .x(d => c.x(d.time))
    .y(d => c.y(d.tdc))
    .curve(d3.curveStep)


  svg.appendMany('path', _.shuffle(game.players))
    .at({
      d: line,
      fill: 'none',
      stroke: (d, i) => i < 5 ? '#f0f' : 'steelblue'
    })
    .call(d3.attachTooltip)

  //mk tg cg h maxHealth



}

