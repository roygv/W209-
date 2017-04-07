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
                    AgIGraph.updateSeries(d.series, d.label);
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
            {label: "Battery SoC", row: 1, col: 1,  series:"% share MW"},
            {label: "Breaker status", row: 1, col: 2,  series:"- INVERTER 1A Mw"},
            {label: "Current state", row: 1, col: 3,  series:"- INVERTER 1B Mw"},
            {label: "Event state", row: 2, col: 1,  series:"- INVERTER 1C Mw"},
            {label: "Heartbeat", row: 2, col: 2,  series:"LMP"},
            {label: "Real automated dispatch", row: 2, col: 3, series:"2 LMP"},
            {label: "Real charge capability", row: 3, col: 1, series:"A Gross GN MW" },
            {label: "Real discharge capability", row: 3, col: 2, series:"A Gross GN MV" },
            {label: "Real dispatch", row: 3, col: 3, series:"2 Base Point" },
            {label: "Real ISO dispatch", row: 4, col: 1, series:"- White Baker (Net) MVA" },
            {label: "Real manual dispatch", row: 4, col: 2, series:"- White Baker (Net) MW" },
            {label: "Real nameplate capacity", row: 4, col: 3, series:"2 Base Point" },
            {label: "Real power", row: 5, col: 1, series:"2 Net MW" },
            {label: "Stored energy", row: 5, col: 2, series:"LAAR, IEM Train A MW" }
//            {label: "LAAR, IEM/B", row: 3, col: 1, series:"LAAR, IEM Train B MW" }
        ],

        coreData: [
            {label: "Battery SoC", row: 1, col: 1,  series:"% share MW"},
            {label: "Array Meters", row: 1, col: 2,  series:"- INVERTER 1A Mw"},
            {label: "Real charge capability", row: 1, col: 3, series:"A Gross GN MW" },
            {label: "Real discharge capability", row: 2, col: 1, series:"A Gross GN MV" },
            {label: "Real dispatch", row: 2, col: 2, series:"2 Base Point" },
            {label: "Real ISO dispatch", row: 2, col: 3, series:"- White Baker (Net) MVA" },
            {label: "Real manual dispatch", row: 3, col: 1, series:"- White Baker (Net) MW" },
            {label: "Real nameplate capacity", row: 3, col: 2, series:"2 Base Point" },
            {label: "Real power", row: 3, col: 3, series:"2 Net MW" },
            {label: "Stored energy", row: 4, col: 1, series:"LAAR, IEM Train A MW" }
        ],

        nodeData: [
            {label: "AdvancionModeCommand", row: 1, col: 1,  series:"% share MW"},
            {label: "AvgCellTemp", row: 1, col: 2,  series:"- INVERTER 1A Mw"},
            {label: "BMSDCChgCurrent", row: 1, col: 3,  series:"- INVERTER 1B Mw"},
            {label: "BMSDCDisCurrent", row: 2, col: 1,  series:"- INVERTER 1C Mw"},
            {label: "BMSDCV", row: 2, col: 2,  series:"LMP"},
            {label: "Battery SoC", row: 2, col: 3, series:"2 LMP"},
            {label: "Charge Capability", row: 3, col: 1, series:"A Gross GN MW" },
            {label: "CodeHeartBeat", row: 3, col: 2, series:"A Gross GN MV" },
            {label: "Current state", row: 3, col: 3, series:"2 Base Point" },
            {label: "Discharge capability", row: 4, col: 1, series:"- White Baker (Net) MVA" },
            {label: "Dispatch", row: 4, col: 2, series:"- White Baker (Net) MW" },
            {label: "Energy capacity", row: 4, col: 3, series:"2 Base Point" },
            {label: "Event state", row: 5, col: 1, series:"2 Net MW" },
            {label: "GUID", row: 5, col: 2, series:"LAAR, IEM Train A MW" },
            {label: "Heartbeat", row: 5, col: 3, series:"LAAR, IEM Train A MW" },
            {label: "HiCellTemp", row: 6, col: 1, series:"LAAR, IEM Train A MW" },
            {label: "HiCellV", row: 6, col: 2, series:"LAAR, IEM Train A MW" },
            {label: "HiPCVTemp", row: 6 , col: 3, series:"LAAR, IEM Train A MW" },
            {label: "InvertedDCBusVoltage", row: 7, col: 1, series:"LAAR, IEM Train A MW" },
            {label: "LOTOLock", row: 7, col: 2, series:"LAAR, IEM Train B MW" },
            {label: "LoCellTemp", row: 7, col: 3, series:"LAAR, IEM Train B MW" },
            {label: "LoCellV", row: 8, col: 1, series:"LAAR, IEM Train B MW" },
            {label: "LoPCTemp", row: 8, col: 2, series:"LAAR, IEM Train B MW" },
            {label: "Manual Dispatch", row: 8, col: 3, series:"LAAR, IEM Train B MW" },
            {label: "Nameplate capacity", row: 9, col: 1, series:"LAAR, IEM Train B MW" }
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
