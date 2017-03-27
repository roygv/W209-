var AgITable = (function () {
    var tableDiv = d3.select("#telemetryArray");
    var data;
    var initialData = [
        { "name" : "LMP", "id" : 45 },
        { "name" : "001", "id" : 50 },
        { "name" : "002", "id" : 55 },
        { "name" : "003", "id" : 50 },
        { "name" : "004", "id" : 45 },
        { "name" : "bla bla bla", "id" : 50 },
        { "name" : "Padam Padam", "id" : 50 },
        { "name" : "Lorem ipsum", "id" : 55 }
    ];

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
        // var width = 960, height = 500;
        // var data = [
        //     {label: "LMP", row: 1, col: 1,  series:"LMP"},
        //     {label: "2 LMP", row: 1, col: 2 },
        //     {label: "Button 3", row: 1, col: 3 },
        //     {label: "Button 4", row: 2, col: 1 },
        //     {label: "Button 5", row: 2, col: 2 },
        //     {label: "Button 6", row: 2, col: 3 }
        // ]

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
            {label: "LMP", row: 1, col: 1,  series:"LMP"},
            {label: "LMP 2", row: 1, col: 2, series:"2 LMP"},
            {label: "Gross GN MW", row: 1, col: 3, series:"A Gross GN MW" },
            {label: "Gross GN MV", row: 2, col: 1, series:"A Gross GN MV" },
            {label: "Base Point 2", row: 2, col: 2, series:"2 Base Point" },
            {label: "LD2 RRSC", row: 2, col: 3, series:"2 Net MW" }
        ],

        init: function() {
//            tabulate(initialData, ['name']); // 2 column table
                buttonArray(AgITable.data);
        } //init

    };

})();
AgITable.init();
