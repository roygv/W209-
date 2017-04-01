var AgITable = (function () {
    var tableDiv = d3.select("#telemetryArray");
    var data;

// function in charge of the array of tables
    function tabulate(data, columns) {
        var table = d3.select('#telemetryArray').append('table')
        var thead = table.append('thead')
        var	tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
            .selectAll('th')
            .data(columns).enter()
            .append('th')
            .text(function (column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append('td')
            .setAttribute('id',function (d) { return d.value; })
            .text(function (d) { return d.value; });

        return table;
    }

    function buttonArray(data) {
        var svg = d3.select('#telemetryArray svg')
        width = svg.attr("width")
        height = svg.attr("height")

        var button = d3.button()
            .on('press', function(d, i) {
                    console.log("Pressed", d, i, this.parentNode);
                    AgIGraph.updateSeries(d.series);
                    clearAll();
            })
            .on('release', function(d, i) { console.log("Released", d, i, this.parentNode)});

// Add buttons
        var buttons = svg.selectAll('.button')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'button')
            .call(button);

        function clearAll() {
            buttons.selectAll('rect')
                .each(function(d, i) { button.clear.call(this, d, i) });
        }

    }
    return {

        // A public variable
        myPublicVar: "foo",

        data: [
            {label: "% share MW", row: 1, col: 1,  series:"% share MW"},
            {label: "Inverter 1A", row: 1, col: 2,  series:"- INVERTER 1A Mw"},
            {label: "Inverter 1B", row: 1, col: 3,  series:"- INVERTER 1B Mw"},
            {label: "Inverter 1C", row: 1, col: 4,  series:"- INVERTER 1C Mw"},
            {label: "LMP", row: 1, col: 5,  series:"LMP"},
            {label: "LMP 2", row: 1, col: 6, series:"2 LMP"},
            {label: "Gross GN MW", row: 1, col: 7, series:"A Gross GN MW" },
            {label: "Gross GN MV", row: 2, col: 1, series:"A Gross GN MV" },
            {label: "Base Point 2", row: 2, col: 2, series:"2 Base Point" },
            {label: "White Baker MVA", row: 2, col: 3, series:"- White Baker (Net) MVA" },
            {label: "White Baker MW", row: 2, col: 4, series:"- White Baker (Net) MW" },
            {label: "2 Base Point", row: 2, col: 5, series:"2 Base Point" },
            {label: "2 Net MW", row: 2, col: 6, series:"2 Net MW" },
            {label: "LAAR, IEM/A", row: 2, col: 7, series:"LAAR, IEM Train A MW" },
            {label: "LAAR, IEM/B", row: 2, col: 8, series:"LAAR, IEM Train B MW" }
        ],

        init: function() {
//            tabulate(initialData, ['name']); // 2 column table
                buttonArray(AgITable.data);
        } //init

    };

})();
AgITable.init();
