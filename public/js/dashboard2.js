angular.module('app.dash', [])
    .controller('DashController', ['$scope', '$http', function($scope, $http) {
        var dash = this;
        dash.inputName = '';

        dash.changeInput = () => {
            dash.loading = 'Patience! Data Is On Its Way...';
            $http({
                method: 'GET',
                url: '/api/ACLED',
                params: {
                    countryName: dash.inputName
                }
            }).then(function(returnData) {
                var data = {};
                data = returnData.data.data;

                if (data) {
                    dash.loading = '';
                };
                var totalData = data.length;
                for (var k = 0; k < data.length; k++) {
                    data[k].event_types = [data[k].event_type];
                    data[k].longitude = Number(data[k].longitude);
                    //console.log(data[k].longitude);
                    data[k].lon = [];
                    data[k].lon[0] = data[k].longitude;
                    data[k].latitude = Number(data[k].latitude);
                    data[k].lat = [];
                    data[k].lat[0] = data[k].latitude;
                    data[k].fatalities = parseInt(data[k].fatalities);
                    data[k].number_events = 1;
                }

                //Geo plots below
                var center = [Number(data[0].latitude), Number(data[0].longitude)];
                if (dash.map != undefined || dash.map != null) {
                  dash.map.remove();
                }
                dash.map = L.map('mapid', {
                  center: center,
                  minZoom: 4,
                  maxZoom: 7,
                  zoom:5,
                  zoomControl:false,
                });
                L.tileLayer('https://api.mapbox.com/styles/v1/josephseverino/cixtc84tb000v2snxszx9br6g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZXBoc2V2ZXJpbm8iLCJhIjoiY2l4dGE4OWI4MDAwajJxcXExYmpiNTVpaCJ9.H3f8THrMs3FkcvIjphYpAw', {
                  attribution: 'MapBox and Leaflet',
                  maxZoom: 18,

                }).addTo(dash.map);
                //adding bubbles to map

                // for(var i = 0; i < dash.days; i++ ){
                //   var latlon = [];
                //   latlon[0] = parseInt(data[i].latitude);
                //   latlon[1] = parseInt(data[i].longitude);
                //   var circle = L.circle(latlon, {
                //     color: 'black',
                //     fillColor: 'red',
                //     fillOpacity: 0.05,
                //     radius: 10000
                //   }).addTo(dash.map);
                // }
                for (var i = 0; i < data.length; i++) {

                    for (var j = i + 1; j < data.length; j++) {
                        if (data[i].event_date == data[j].event_date) {
                            data[i].number_events += 1;
                            data[i].lon.push(data[j].longitude);
                            data[i].lat.push(data[j].latitude);
                            data[i].event_types.push(data[j].event_type);
                            data[i].fatalities += data[j].fatalities;
                            data.splice(j, 1);
                            j -= 1;
                        }
                    }
                }
                data.current = dash.days;
                if(data.current == 0){
                  data.current = data.length-1;
                }
                dash.dateBeginning = data[data.current].event_date;
                dash.dateEnding = data[0].event_date;
                console.log(data);

                var deaths = [],
                    dates = [],
                    events = [],
                    counts = {},
                    event_type = [counts];

                for (var i = 0; i < data.current; i++) {
                    event_type.push(data[i].event_types
                        .forEach(function(x) {
                            counts[x] = (counts[x] || 0) + 1;
                        })
                    );

                    deaths.push(data[i].fatalities);
                    dates.push(data[i].event_date);
                    events.push(data[i].number_events)
                }
                var list = event_type[0];
                var numArray = Object.values(list);
                numArray = numArray.sort((a, b) => a - b);
                console.log(numArray);
                var list = event_type[0];
                keysSorted = Object.keys(list).sort(function(a, b) {
                    return list[a] - list[b]
                });
                console.log(keysSorted);
                var ctx3 = document.getElementById("radarChart");
                if (dash.myRadarChart != undefined || dash.myRadarChart != null) {
                    dash.myRadarChart.destroy();
                }
                dash.myRadarChart = new Chart(ctx3, {
                    type: 'radar',
                    data: {
                        labels: keysSorted,
                        datasets: [{
                            label: "My First dataset",
                            backgroundColor: "rgba(29,24,60,.4)",
                            borderColor: "rgba(29,24,60,1)",
                            pointBackgroundColor: "rgba(29,24,60,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(29,24,60,1)",
                            data: numArray
                        }]
                    }
                });

                var ctx4 = document.getElementById("donutChart");
                if (dash.myDoughnutChart != undefined || dash.myDoughnutChart != null) {
                    dash.myDoughnutChart.destroy();
                }
                dash.myDoughnutChart = new Chart(ctx4, {
                    type: 'doughnut',
                    animation: {
                        animateScale: true
                    },
                    data: {
                        labels: keysSorted,
                        datasets: [{
                            data: numArray,
                            backgroundColor: [
                                "#ED254E",
                                "#F9DC5C",
                                "#C2EABD",
                                "#011936",
                                "#465362",
                                "#F1FAEE",
                                "#A8DADC",
                                "#457B9D"
                            ],
                            hoverBackgroundColor: [
                                "#ED254E",
                                "#F9DC5C",
                                "#C2EABD",
                                "#011936",
                                "#465362",
                                "#F1FAEE",
                                "#A8DADC",
                                "#457B9D"
                            ]
                        }]
                    },
                });
                var ctx = document.getElementById("fatalitiesChart");
                // dash.myLineChart = undefined;
                if (dash.myLineChart != undefined || dash.myLineChart != null) {
                    dash.myLineChart.destroy();
                }
                console.log(dash.myLineChart)
                dash.myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: "Fatalities",
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "black",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: deaths,
                            spanGaps: false,
                        }, {
                            type: 'line',
                            label: 'Line Component',
                            data: events,
                            backgroundColor: "rgba(255,255,0,0.3)",
                            borderColor: "rgba(255,255,0,1)"
                        }]
                    }
                });

                var ctx2 = document.getElementById("eventChart");
                if (dash.myEventChart != undefined || dash.myEventChart != null) {
                    dash.myEventChart.destroy();
                }
                dash.myEventChart = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: "Number Of Events",
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: "rgba(255,255,0,0.3)",
                            borderColor: "rgba(255,255,0,1)",
                            borderCapStyle: 'orange',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "black",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: events,
                            spanGaps: false,
                        }]
                    }
                });
                $(function() {

                    var gaugeOptions = {

                        chart: {
                            type: 'solidgauge',
                            backgroundColor: '#999'
                        },

                        title: null,

                        pane: {
                            center: ['50%', '85%'],
                            size: '140%',
                            startAngle: -90,
                            endAngle: 90,
                            background: {
                                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                                innerRadius: '60%',
                                outerRadius: '100%',
                                shape: 'arc'
                            }
                        },

                        tooltip: {
                            enabled: false
                        },

                        // the value axis
                        yAxis: {
                            stops: [
                                [0.1, 'green'], // green
                                [0.5, 'yellow'], // yellow
                                [0.9, 'red'] // red
                            ],
                            lineWidth: 0,
                            minorTickInterval: null,
                            tickAmount: 2,
                            title: {
                                y: -70
                            },
                            labels: {
                                y: 16
                            }
                        },

                        plotOptions: {
                            solidgauge: {
                                dataLabels: {
                                    y: 5,
                                    borderWidth: 0,
                                    useHTML: true
                                }
                            }
                        }
                    };

                    // The speed gauge
                    dash.chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
                        yAxis: {
                            min: 0,
                            max: totalData,
                            title: {
                                text: 'Total Data'
                            }
                        },

                        credits: {
                            enabled: false
                        },

                        series: [{
                            name: 'Speed',
                            data: [totalData],
                            dataLabels: {
                                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                    '<span style="font-size:12px;color:silver">Points of Data</span></div>'
                            },
                            tooltip: {
                                valueSuffix: 'Data Points'
                            }
                        }]

                    }));

                    // The RPM gauge
                    dash.chartRpm = Highcharts.chart('container-rpm', Highcharts.merge(gaugeOptions, {
                        yAxis: {
                            min: 0,
                            max: 100,
                            title: {
                                text: 'Current Amount of Data'
                            }
                        },

                        series: [{
                            name: 'RPM',
                            data: [data.current / data.length * 100],
                            dataLabels: {
                                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                                    '<span style="font-size:12px;color:silver">Percent of Total Data</span></div>'
                            },
                            tooltip: {
                                valueSuffix: ' revolutions/min'
                            }
                        }]

                    }));
                    dash.chartRpm2 = Highcharts.chart('container-rpm2', Highcharts.merge(gaugeOptions, {
                        yAxis: {
                            min: 0,
                            max: data.length,
                            title: {
                                text: 'Current Amount of Data'
                            }
                        },

                        series: [{
                            name: 'RPM',
                            data: [data.length],
                            dataLabels: {
                                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                                    '<span style="font-size:12px;color:silver">Total Days of Data</span></div>'
                            },
                            tooltip: {
                                valueSuffix: ' revolutions/min'
                            }
                        }]

                    }));
                });
            })
        }
    }]);
