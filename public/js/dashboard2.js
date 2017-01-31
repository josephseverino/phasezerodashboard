function toNumDate(str) {
    var cat = str.slice(0, 4) + str.slice(5, 7) + str.slice(8, 10);
    var dateNum = Number(cat);
    return dateNum;
}
angular.module('app.dash', [])
    .controller('DashController', ['$scope', '$http', function($scope, $http) {
        var dash = this;
        dash.inputName = 'Nigeria';
        dash.days = 30;


        dash.changeInput = () => {
            dash.loading = 'Sit back while we prepare your data...';
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
                }
                var totalData = data.length;
                dash.total = totalData;
                console.log(data);
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
                    data[k].deaths = [];
                    data[k].deaths[0] = data[k].fataleties;
                    data[k].info = [];
                    data[k].info[0] = data[k].notes;
                    data[k].number_events = 1;
                }

                //Geo plots below
                var center = [Number(data[0].latitude), Number(data[0].longitude)];
                if (dash.map != undefined || dash.map != null) {
                    dash.map.remove();
                }
                dash.map = L.map('mapid', {
                    center: center,
                    minZoom: 5,
                    maxZoom: 18,
                    tap: true,
                    zoom: 6,
                    zoomWheelZoom: false,
                });
                L.tileLayer('https://api.mapbox.com/styles/v1/josephseverino/cixtc84tb000v2snxszx9br6g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZXBoc2V2ZXJpbm8iLCJhIjoiY2l4dGE4OWI4MDAwajJxcXExYmpiNTVpaCJ9.H3f8THrMs3FkcvIjphYpAw', {
                    attribution: 'MapBox and Leaflet',
                    maxZoom: 18,

                }).addTo(dash.map);


                //adding bubbles to map

                dash.geoMap = () => {
                  var color = '',
                      colorFill = '',
                      fillOpacity = '';
                    if (dash.eventType == "Strategic Development") {
                        color = 'rgba(150,0,0,.3)';
                        fillColor = "rgba(150,0,0,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Headquarters or base established") {
                        color = 'rgba(0,150,0,.3)';
                        fillColor = "rgba(0,150,0,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Battle-Non-state actor overtakes territory") {
                        color = 'rgba(0,0,150,.3)';
                        fillColor = "rgba(0,0,150,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Battle-Government regains territory") {
                        color = 'rgba(150,150,0,.3)';
                        fillColor = "rgba(150,150,0,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Non-violent transfer of territory") {
                        color = 'rgba(250,150,0,.3)';
                        fillColor = "rgba(250,50,20,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Strategic development") {
                        color = 'rgba(150,0,150,.3)';
                        fillColor = "rgba(150,0,150,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Riots/Protests") {
                        color = 'rgba(75,0,0,.3)';
                        fillColor = "rgba(75,0,0,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Remote violence") {
                        color = 'rgba(0,75,0,.3)';
                        fillColor = "rgba(0,75,0,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Violence against civilians") {
                        color = 'rgba(0,0,75,.3)';
                        fillColor = "rgba(0,0,75,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "Battle-No change of territory") {
                        color = 'rgba(0,150,150,.3)';
                        fillColor = "rgba(0,150,150,1)";
                        fillOpacity = ".1";
                    } else if (dash.eventType == "0") {
                        color = '';
                        fillColor = "";
                        fillOpacity = "";
                    }
                    for (var i = 0; i < data.length; i++) {
                        var dateDate = [];
                        dateDate[i] = toNumDate(data[i].event_date);
                        //console.log(dateDate[i]);
                        var startRange = Number(dash.firstYear + dash.firstMonth + dash.firstDay);
                        var endRange = Number(dash.lastYear + dash.lastMonth + dash.lastDay);
                        if (dateDate[i] >= startRange && dateDate[i] <= endRange) {
                            //console.log('hiuguyf')
                            for (var m = 0; m < data[i].event_types.length; m++) {
                                if (dash.eventType == data[i].event_types[m]) {
                                    var Info ='<h1>' + data[i].event_types[m] + '</h1><h3 class="popup">NOTES: </h3>';
                                    Info += data[i].info[m] + '<br>'+ '<h3 class="popup">DATE: </h3>' + data[i].event_date + '<br>'+
                                       '<h3 class="popup">FATALITIES: </h3>' + data[i].deaths[m] + '<br>'+
                                       '<h3 class="popup">SOURCE:</h3>' + data[i].source;
                                    console.log(dash.eventType, data[i].event_types[m]);
                                    var latlon = [];
                                    latlon[0] = data[i].lat[m];
                                    latlon[1] = data[i].lon[m];

                                    dash.layer = L.circleMarker(latlon, {
                                        color: color,
                                        weight: 1,
                                        fillColor: fillColor,
                                        fillOpacity: fillOpacity,
                                        radius: 30
                                    }).addTo(dash.map).bindPopup(Info);


                                    dash.clearMap = () => {
                                      dash.map.remove();
                                      dash.map = L.map('mapid', {
                                          center: center,
                                          minZoom: 5,
                                          maxZoom: 18,
                                          tap: true,
                                          zoom: 6,
                                          zoomWheelZoom: false,
                                      });
                                      L.tileLayer('https://api.mapbox.com/styles/v1/josephseverino/cixtc84tb000v2snxszx9br6g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZXBoc2V2ZXJpbm8iLCJhIjoiY2l4dGE4OWI4MDAwajJxcXExYmpiNTVpaCJ9.H3f8THrMs3FkcvIjphYpAw', {
                                          attribution: 'MapBox and Leaflet',
                                          maxZoom: 18,

                                      }).addTo(dash.map);

                                    }

                                }

                            }
                        }
                    }
                }


                for (var i = 0; i < data.length; i++) {

                    for (var j = i + 1; j < data.length; j++) {
                        if (data[i].event_date == data[j].event_date) {
                            data[i].number_events += 1;
                            data[i].lon.push(data[j].longitude);
                            data[i].lat.push(data[j].latitude);
                            data[i].event_types.push(data[j].event_type);
                            data[i].deaths.push(data[j].fatalities);
                            data[i].info.push(data[j].notes);
                            data[i].fatalities += data[j].fatalities;
                            data.splice(j, 1);
                            j -= 1;
                        }
                    }
                }
                dash.current = dash.days;
                if (dash.current == 0) {
                    dash.current = data.length - 1;
                }
                dash.dateBeginning = data[dash.current].event_date;
                dash.dateEnding = data[0].event_date;
                //console.log(data);

                var deaths = [],
                    dates = [],
                    events = [],
                    counts = {},
                    event_type = [counts];

                for (var i = dash.current; i >= 0; i--) {
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
                //console.log(numArray);
                var list = event_type[0];
                keysSorted = Object.keys(list).sort(function(a, b) {
                    return list[a] - list[b]
                });
                //console.log(keysSorted);
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
                                "rgba(150,0,0,.5)",
                                "rgba(0,150,0,.5)",
                                "rgba(0,0,150,.5)",
                                "rgba(150,150,0,.5)",
                                "rgba(150,150,150,.5)",
                                "rgba(0,150,150,.5)",
                                "rgba(150,0,150,.5)",
                                "rgba(75,0,0,.5)",
                                "rgba(0,75,0,.5)",
                                "rgba(0,0,75,.5)"

                            ],
                            hoverBackgroundColor: [
                                "rgba(150,0,0,1)",
                                "rgba(0,150,0,1)",
                                "rgba(0,0,150,1)",
                                "rgba(150,150,0,1)",
                                "rgba(150,150,150,1)",
                                "rgba(0,150,150,1)",
                                "rgba(150,0,150,1)",
                                "rgba(75,0,0,1)",
                                "rgba(0,75,0,1)",
                                "rgba(0,0,75,1)"
                            ]
                        }]
                    },
                    options: {
                        legend: {
                            position: 'left',
                        }
                    }
                });
                var ctx = document.getElementById("fatalitiesChart");
                // dash.myLineChart = undefined;
                if (dash.myLineChart != undefined || dash.myLineChart != null) {
                    dash.myLineChart.destroy();
                }
                //console.log(dash.myLineChart)
                dash.myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: "Fatalities",
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: "rgba(150,0,0,0.4)",
                            borderColor: "rgba(150,0,0,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(150,0,0,1)",
                            pointBackgroundColor: "black",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(150,0,0,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: deaths,
                            spanGaps: false,
                        }, {
                            type: 'line',
                            label: 'Number of Events',
                            data: events,
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderColor: "rgba(0,0,0,.7)"
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
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderColor: "rgba(0,0,0,5)",
                            borderCapStyle: 'black',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(0,0,0,.5)",
                            pointBackgroundColor: "black",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(0,0,0,.5)",
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
                                [0.1, 'rgba(0,150,0,.5)'], // green
                                [0.5, 'rgba(250,250,0,.5)'], // yellow
                                [0.9, 'rgba(150,0,0,.5)'] // red
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
                    // dash.chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
                    //     yAxis: {
                    //         min: 0,
                    //         max: totalData,
                    //         title: {
                    //             text: 'Total Data'
                    //         }
                    //     },
                    //
                    //     credits: {
                    //         enabled: false
                    //     },
                    //
                    //     series: [{
                    //         name: 'Speed',
                    //         data: [totalData],
                    //         dataLabels: {
                    //             format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    //                 ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    //                 '<span style="font-size:12px;color:silver">Points of Data</span></div>'
                    //         },
                    //         tooltip: {
                    //             valueSuffix: 'Data Points'
                    //         }
                    //     }]
                    //
                    // }));

                    // The RPM gauge
                    if (dash.chartRpm != undefined || dash.chartRpm != null) {
                        dash.chartRpm.destroy();
                    }
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
                            data: [dash.current / data.length * 100],
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
                    // dash.chartRpm2 = Highcharts.chart('container-rpm2', Highcharts.merge(gaugeOptions, {
                    //     yAxis: {
                    //         min: 0,
                    //         max: data.length,
                    //         title: {
                    //             text: 'Current Amount of Data'
                    //         }
                    //     },
                    //
                    //     series: [{
                    //         name: 'RPM',
                    //         data: [data.length],
                    //         dataLabels: {
                    //             format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    //                 ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    //                 '<span style="font-size:12px;color:silver">Total Days of Data</span></div>'
                    //         },
                    //         tooltip: {
                    //             valueSuffix: ' revolutions/min'
                    //         }
                    //     }]
                    //
                    // }));
                });
            })
        }
        window.onload = dash.changeInput;
    }]);
