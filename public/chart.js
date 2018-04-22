const id='chart';
var sensorData;
var sensorLabel = "";
var zoomLevel = 300000;
var ctx;
var chart;
var config = {
    type: 'line',
    data: {
        datasets: [{
            data: [],
            label: '',                     // 'buy' price data
            borderColor: 'rgb(255, 99, 132)', // line color
            backgroundColor: 'rgba(255, 99, 132, 0.5)', // fill color
            fill: false,                      // no fill
            lineTension: 0                    // straight line
        }]
    },
    options: {
        responsive: false,
        title: {
            text: 'BTC/USD (' + id + ')', // chart title
            display: true
        },
        scales: {
            xAxes: [{
                type: 'realtime' // auto-scroll on X axis
            }]
        },
        plugins: {
            streaming: {
                duration: zoomLevel, // display data for the latest 300000ms (5 mins)
						// refresh: 60000,
						// onRefresh: onRefresh
                
            }
        }
    }
};


const zoom = function zoom(zoomAdd=true) {
    factor = 3000;
    if (zoomAdd) {
        if (zoomLevel > 50000)
        factor = 50000;
        if (zoomLevel < 10000)
        factor = 500;
        zoomLevel = zoomLevel + factor;
    } else {
        if (zoomLevel < 5000)
        factor = 500;
        if (zoomLevel > 100000)
        factor = 50000;
        zoomLevel = zoomLevel - factor;
    }

    config.options.plugins.streaming.duration = zoomLevel;
    chart.update();

}
const getSensorData = function getSensorData(sensorvalue) {
    console.log("getsensor data  called", sensorvalue);
    try {
    sensorLabel = sensorvalue.id;
    sensorData = {
        x: new Date(sensorvalue.timestamp),
        y: sensorvalue.data
    };
    config.data.datasets[0].data.push(sensorData);
    config.data.label = sensorLabel;
    } catch(e) {
        chart.update();
    }
    chart.update();
    console.log( config.data.datasets[0].data.length);
    
}

const drawChart = function drawChart() {
    console.log("draw chart called");
    ctx = document.getElementById(id).getContext('2d');
    ctx.canvas.width = '700';
    ctx.canvas.height = '300';
    chart = new Chart(ctx, config);
}

const destroyChart = function destroyChart() {
    console.log('Destroy called');
    chart.destroy();
    sensorData = null;
    config.data.datasets[0].data = [];
}
// const chart = {
//     c3Chart: c3.generate({
//         bindto: '#graph',
//         data: {
//             x: 'x',
//             columns: []
//         },
//         axis: {
//             x: {
//                 type: 'timeseries',
//                 tick: {
//                     format: '%X'
//                 }
//             }
//         }
//     }),
//     MAX_DATA_POINTS: 20,
//     columns: [['x']],
//     handleChart: function (sensorData) {

//         if (!this.columns.some(l => l[0] === sensorData.id))
//             this.columns.push([sensorData.id]);

//         this.appendTimeStamp(new Date(sensorData.timestamp));

//         const colIndex = this.columns.map(c => c[0]).indexOf(sensorData.id);
//         this.appendColumn(colIndex, sensorData.data);

//         this.c3Chart.load({
//             columns: this.columns
//         });
//     },
//     appendTimeStamp: function (timeStamp) {
//         timeStamp.setUTCMilliseconds(0);

//         if (!this.columns[0].some(i => i !== 'x' && i.getTime() === timeStamp.getTime())) {
//             this.columns[0].push(timeStamp);

//             if (this.columns[0].length > this.MAX_DATA_POINTS) {
//                 this.columns[0].splice(1, 1);
//             }
//         }
//     },
//     appendColumn: function (index, temperature) {

//         while (this.columns[0].length - 1 > this.columns[index].length) {
//             this.columns[index].push(temperature);
//         }

//         this.columns[index].push(temperature);

//         if (this.columns[index].length > this.MAX_DATA_POINTS) {
//             this.columns[index].splice(1, 1);
//         }
//     },
//     removeChartValues: function (sensorId) {

//         // TODO: Fix unloading, reloading

//         const colIndex = this.columns.map(c => c[0]).indexOf(sensorId);
//         this.columns.splice(colIndex, 1);

//         // this.columns[colIndex].splice(1, this.MAX_DATA_POINTS);

//         this.c3Chart.unload({
//             ids: sensorId
//         });
//     }
// };