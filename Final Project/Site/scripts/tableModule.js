var AgITable = (function () {
    var tableDiv = d3.select("#telemetryArray");
    var data;

// function in charge of the array of tables
    function tabulate(data, columns) {
        var table = d3.select('#telemetryArray').append('table');
        var thead = table.append('thead');
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
                    AgIGraph.updateSeries(d.series, d.measurement, d.label.replace(/:.*/,''));
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
                
                
        arrayData: [
            {label: "CPU User", row: 1, col: 1, series:"usage_user", measurement:"cpu" },
            {label: "CPU System", row: 1, col: 2, series:"usage_system", measurement:"cpu" },
            {label: "CPU Idle", row: 1, col: 3, series:"usage_idle", measurement:"cpu" },
            {label: "CPU I/O wait", row: 2, col: 1,  series:"usage_iowait", measurement:"cpu"},
            {label: "CPU soft IRQ", row: 2, col: 2, series:"usage_softirq", measurement:"cpu" },
            {label: "Query Requests", row: 2, col: 3, series:"queryReq", measurement:"influxdb_httpd" },
            {label: "Query Duration", row: 3, col: 1, series:"queryReqDurationNs", measurement:"influxdb_httpd" },
            {label: "Points Written", row: 3, col: 2, series:"pointsWrittenOK", measurement:"influxdb_httpd" }
 //            {label: "LAAR, IEM/B", row: 3, col: 1, series:"LAAR, IEM Train B MW" }
        ],

        coreData: [
            {label: "CPU User", row: 1, col: 1, series:"usage_user", measurement:"cpu" },
            {label: "CPU System", row: 1, col: 2, series:"usage_system", measurement:"cpu" },
            {label: "CPU Idle", row: 1, col: 3, series:"usage_idle", measurement:"cpu" },
            {label: "CPU I/O wait", row: 2, col: 1,  series:"usage_iowait", measurement:"cpu" },
            {label: "CPU soft IRQ", row: 2, col: 2, series:"usage_softirq", measurement:"cpu" },
            {label: "Query Requests", row: 2, col: 3, series:"queryReq", measurement:"influxdb_httpd" }
        ],

        nodeData: [
            {label: "Battery charge", row: 1, col: 1,  series:"Wind speed (MPH)", measurement:"cpu"},
            {label: "AvgCellTemp", row: 1, col: 2,  series:"- INVERTER 1A Mw", measurement:"cpu"},
            {label: "BMSDCChgCurrent", row: 1, col: 3,  series:"- INVERTER 1B Mw", measurement:"cpu"},
            {label: "BMSDCDisCurrent", row: 2, col: 1,  series:"- INVERTER 1C Mw", measurement:"cpu"},
            {label: "BMSDCV", row: 2, col: 2,  series:"LMP", measurement:"cpu"},
            {label: "Advancion Cmd.", row: 2, col: 3, series:"2 LMP", measurement:"cpu"},
            {label: "Charge Capability", row: 3, col: 1, series:"A Gross GN MW", measurement:"cpu" },
            {label: "CodeHeartBeat", row: 3, col: 2, series:"A Gross GN MV", measurement:"cpu" },
            {label: "Current state", row: 3, col: 3, series:"2 Base Point", measurement:"cpu" },
            {label: "Discharge cap.", row: 4, col: 1, series:"- White Baker (Net) MVA", measurement:"cpu" },
            {label: "CPU soft IRQ", row: 4, col: 2, series:"usage_softirq", measurement:"cpu" },
            {label: "CPU User", row: 1, col: 2,  series:"usage_iowait", measurement:"cpu" },
            {label: "CPU I/O wait", row: 1, col: 2,  series:"usage_iowait", measurement:"cpu" },
            {label: "CPU idle", row: 5, col: 1, series:"usage_idle", measurement:"cpu" },
            {label: "GUID", row: 5, col: 2, series:"LAAR, IEM Train A MW", measurement:"cpu" },
            {label: "Heartbeat", row: 5, col: 3, series:"LAAR, IEM Train A MW", measurement:"cpu" },
            {label: "HiCellTemp", row: 6, col: 1, series:"LAAR, IEM Train A MW", measurement:"cpu" },
            {label: "Capacity", row: 9, col: 1, series:"2 Net MW (to ERCOT)", measurement:"cpu" }
        ],

        init: function(nodeType) {
                d3.selectAll(".button").remove();
//            tabulate(initialData, ['name']); // 2 column table
                if ((nodeType == 'Site') || (nodeType == 'Array') || (nodeType == ''))
                    buttonArray(AgITable.arrayData);
                else if (nodeType == 'Core')
                    buttonArray(AgITable.coreData);
                else
                    buttonArray(AgITable.nodeData);
                $("button:first").trigger('press');
        } //init

    };

})();
AgITable.init("Site");
