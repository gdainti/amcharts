var Graph = {

    graph1: [],
    graph2: [],

    init: function(url, success, error) {

        var demoGraphData = $('#graphData'); // get demo json data from html
        if (demoGraphData.length) {
            var data = JSON.parse(demoGraphData.html());
            if (data) success(data);

        } else { // try to send ajax request (requires nodejs server running)

            $.ajax({
                dataType: "json",
                url: url,
                success: success,
                error: error
            });
        }

    },

    sortGraph: function(list, key) {
        function compare(a, b) {
            a = a[key];
            b = b[key];
            var type = (typeof(a) === 'string' ||
            typeof(b) === 'string') ? 'string' : 'number';
            var result;
            if (type === 'string') result = a.localeCompare(b);
            else result = a - b;
            return result;
        }
        return list.sort(compare);
    },

    filterGraphByDate: function(list, value) {
        return $.grep(list, function(v) {
            return ('' + v.date) === ('' + value);
        });
    },

    showGraph1: function(graph) {

        var chart = AmCharts.makeChart( "graph1", {
            "type": "serial",
            "addClassNames": true,
            "theme": "light",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,

            "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
            },

            "dataProvider": graph,

            "valueAxes": [ {
                "axisAlpha": 0,
                "position": "left"
            } ],
            "startDuration": 1,
            "graphs": [ {
                "alphaField": "alpha",
                "fillAlphas": 1,
                "title": "Value",
                "type": "column",
                "valueField": "value",
                "dashLengthField": "dashLengthColumn"
            }],
            "categoryField": "date",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });

        chart.addListener("clickGraphItem", this.clickColumnEvent);

    }, // /show graph1

    clickColumnEvent: function(event) {
        Graph.showGraph2( Graph.filterGraphByDate(Graph.graph2, event.item.category) );
    },

    showGraph2: function(graph) {

        var categoryWidth = 40;

        AmCharts.addInitHandler(function(chart) {

            var offsets = 100;
            var categoryPadding = categoryWidth + (categoryWidth * 0.1);
            var $graph2 = document.getElementById("graph2");

            $graph2.style.display = "none"; // hide to invalidate size

            var chartHeight = chart.dataProvider.length * (categoryWidth + categoryPadding) + offsets;

            // set chart height
            $graph2.style.overflow = "visible";
            $graph2.style.height = "" + chartHeight + "px";

            setTimeout(function () {
                chart.invalidateSize();
                $graph2.style.display = "block";
            }, 1);
        }, ['serial']);

        var chart = AmCharts.makeChart("graph2", {
            "type": "serial",
            "theme": "light",
            "dataProvider": graph,

            "valueAxes": [{
                "dashLength": 0
            }],

            "startDuration": 1,

            "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
            },

            "graphs": [{
                "title": "Code",
                "type": "column",
                "fillAlphas": 0.8,
                "fixedColumnWidth": categoryWidth,
                "valueField": "code",
                "dashLengthField": "dashLengthColumn"
            }],
            "rotate": true,
            "categoryField": "description",
            "categoryAxis": {
                "gridAlpha": 0,
                "tickLength": 0
            }
        });

    } // /show graph2
};


Graph.init('graph.json', // url

    function success(data) {

        if (data.graph1 !== undefined && data.graph2 !== undefined) {

            Graph.graph1 = Graph.sortGraph(data.graph1, 'date');
            Graph.graph2 = Graph.sortGraph(data.graph2, 'code');
            Graph.showGraph1(Graph.graph1);

        } else alert('json file must contain graph1[] and graph2[]');
    },

    function error(data) {
        alert('wrong json file');
    }
);


