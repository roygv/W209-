var sparkLine = (function () {
    var width = 300;
    var height = 180, titleHeight = 20, axisHeight = 20;

    var x = d3.scaleUtc().range([0, width - 2]);
    var y = d3.scaleLinear().range([height - axisHeight - 4, titleHeight]);
    var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var line = d3.area()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y0(height-axisHeight)
        .y1(function(d) { return y(d.value); });

    return {

        draw: function(position, title, elemId, data) {
                    len = data.length;
                    data.forEach(function(d) {
                        d.date = AgIData.parseDate(d[0]);
                        d.value = +d[1];
                    });
                    x.domain(d3.extent(data, function(d) { return d.date; }));
                    y.domain(d3.extent(data, function(d) { return d.value; }));

                    var svg = d3.select(elemId)
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .append('g')
                        .attr('transform', 'translate(20,'+position * height+')');
                        // .attr('transform', 'translate('+position * height+',50)');

                    svg.append('rect')
                        .attr("class", "sparkback")
                        .attr("width", width-1)
                        .attr("height", height-1);
                    svg.append('path')
                        .datum(data)
                        .attr('class', 'sparkline')
                        .attr('d', line);
                    svg.append('circle')
                        .attr('class', 'sparkcircle')
                        .attr('cx', x(data[len-2].date))
                        .attr('cy', y(data[len-2].value))
                        .attr('r', 1.5);
                    svg.append('text')
                        .attr('class', 'sparktitle')
                        .text(title+': '+d3.format(".5")(data[len-2].value))
                        .attr('text-anchor','top')
                        .attr('transform', 'translate(5,5)');
                    svg.append("g")
                        .attr("class", "axis axis--x")
                        .attr("transform", "translate(0," + (height - axisHeight) + ")")
                        .call(xAxis.ticks(4));
                    svg.append("g")
                        .attr("class", "axis axis--y")
                        .call(yAxis.ticks(4));
                        // .call(xAxis.ticks(4).tickFormat(d3.utcFormat("%b")));

                    if (y.domain()[0] < 0)
                        svg.append('line')
                            .attr("x1","0%")
                            .attr("y1",y(0))
                            .attr("x2","100%")
                            .attr("y2",y(0))
                            .attr("style","stroke:#AFAFAF;stroke-width:0.5")
                    }
    }}
)();

AgIData.getData("2 Base Point",AgIData.parseDate('2017-03-31T00:00:00Z'),AgIData.parseDate('2017-04-01T00:00:00Z'),function(error, json) {
    if (error) throw error;
    if (json.results[0].series) {
        var data = json.results[0].series[0].values;
        sparkLine.draw(0,'Battery SoC(%)','#powerSummary', data);
    }
});

AgIData.getData("A Gross GN MV",AgIData.parseDate('2017-03-31T00:00:00Z'),AgIData.parseDate('2017-04-01T00:00:00Z'),function(error, json) {
    if (error) throw error;
    if (json.results[0].series) {
        var data = json.results[0].series[0].values;
        sparkLine.draw(0,'Real Power(kW)','#powerSummary', data);
    }
});
