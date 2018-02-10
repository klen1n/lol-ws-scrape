console.clear()
d3.select('body').selectAppend('div.tooltip')


///../../remote-games/TRLH1-1002440271.json
d3.loadData('TRLH1-1002440271.json', (err, res) => {
  console.log(err)
  data = res[0]

  c = d3.conventions({
    sel: d3.select('#graph').html('').append('div'),
    layers: 'dcs',
    width: 500,
    height: 500,
    margin: {top: 0, left: 0, right: 0, bottom: 0}
  })


  p2 = data.map(d => d.playerStats[2])
  p7 = data.map(d => d.playerStats[7])

  p2 = processPlayer(p2)
  p7 = processPlayer(p7)

  function processPlayer(array){
    array = array.map(d => ({x: d.x, y: d.y}))

    array.forEach((d, i)=> {
      d.p = i ? array[i - 1] : d
      d.i = i

      var dx = d.x - d.p.x
      var dy = d.y - d.p.y
      d.dist = Math.sqrt(dx*dx + dy*dy)
    })

    return array
  }


  var {x, y, layers: [divSel, ctx, svg]} = c
  
  x.domain([0, 15000])
  y.domain([0, 15000])


  var line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .defined(d => !(d.x == 394 && d.y == 461))
    // .defined(d => d.i < 239)
    .defined(d => d.dist < 4000)

  // svg.append('path').at({d: line(p2), fill: 'none', stroke: '#000'})

  // svg.append('path').at({d: line(p7), fill: 'none', stroke: '#f0f'})

  ctx.strokeStyle = '#000'
  line.context(ctx)(p2)
  ctx.stroke()

  ctx.strokeStyle = '#f0f'
  ctx.beginPath()
  line.context(ctx)(p7)
  ctx.stroke()

  // svg.append('circle')
  //   .translate([c.x(394), c.y(461)])
  //   .at({r: c.x(4000), fill: 'none', stroke: '#0f0'})


})