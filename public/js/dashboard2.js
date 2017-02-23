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
                data = returnData.data.data.reverse();
                if (data) {
                    dash.loading = '';
                }
                dash.total = data.length;

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
                    data[k].deaths[0] = data[k].fatalities;
                    data[k].act1 = [];
                    data[k].act1[0] = data[k].actor1;
                    data[k].act2 = [];
                    data[k].act2[0] = data[k].actor2;
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
                                    var Info = '<h1>' + data[i].event_types[m] + '</h1><h3 class="popup">NOTES: </h3>';
                                    Info += data[i].info[m] + '<br>' + '<h3 class="popup">DATE: </h3>' + data[i].event_date + '<br>' +
                                        '<h3 class="popup">FATALITIES: </h3>' + data[i].deaths[m] + '<br>' +
                                        '<h3 class="popup">SOURCE:</h3>' + data[i].source + '<br>' +
                                        '<h3 class="popup">ACTOR 1:</h3>' + data[i].act1[m] + '<br>' +
                                        '<h3 class="popup">ACTOR 2:</h3>' + data[i].act2[m];
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
                            data[i].act1.push(data[j].actor1);
                            data[i].act2.push(data[j].actor2);
                            data.splice(j, 1);
                            j -= 1;
                        }
                    }
                }
                var indexStart = data.length - 31;
                // console.log(toNumDate(data[4].event_date));
                // console.log(Number(dash.startYear + dash.startMonth + dash.startDay));
                // console.log(Number(dash.endYear + dash.endMonth + dash.endDay));
                for (var i = 0; i < data.length; i++) {

                    if (toNumDate(data[i].event_date) >= Number(dash.startYear + dash.startMonth + dash.startDay)) {
                        indexStart = i;
                        //console.log('line 193:startdate', i);
                        break;
                    }
                }
                var indexend = data.length;
                for (var i = 0; i < data.length; i++) {

                    if (toNumDate(data[i].event_date) >= Number(dash.endYear + dash.endMonth + dash.endDay)) {
                        indexend = i;
                        //console.log('line 202:enddate', i);
                        break;
                    }
                }
                dash.totalDates = data.length;
                dash.current = indexend - indexStart || 30;
                dash.dayPercent = (((indexend - indexStart || 30) / data.length) * 100).toFixed(1);
                // if (dash.current == 0) {
                //     dash.current = data.length - 1;
                // }
                dash.dateBeginning = dash.startYear + "-" + dash.startMonth + "-" + dash.startDay;
                dash.dateEnding = dash.endYear + "-" + dash.endMonth + "-" + dash.endDay;
                //console.log(data);

                var deaths = [],
                    dates = [],
                    events = [],
                    counts = {},
                    event_type = [counts];

                for (var i = 0; i < data.length; i++) {
                    event_type.push(data[i].event_types
                        .forEach(function(x) {
                            counts[x] = (counts[x] || 0) + 1;
                        })
                    );

                    deaths.push(data[i].fatalities);
                    dates.push(data[i].event_date);
                    events.push(data[i].number_events);
                }

                //creating arrays for individual event data
                var strDev = [],
                    hq_base = [],
                    battle_no_state = [],
                    battle_gov = [],
                    non_violent = [],
                    stratDev = [],
                    riots = [],
                    remoteViol = [],
                    violenceCiv = [],
                    battle_no_change = [],
                    total_SD = 1,
                    total_HQ = 0,
                    total_BNS = 0,
                    total_BG = 0,
                    total_NV = 0,
                    total_R = 0,
                    total_RV = 0,
                    total_VC = 0,
                    total_BNC = 0;

                for (var i = 0; i < data.length; i++) {
                    strDev.push(0);
                    hq_base.push(0);
                    battle_no_state.push(0);
                    battle_gov.push(0);
                    non_violent.push(0);
                    stratDev.push(0);
                    riots.push(0);
                    remoteViol.push(0);
                    violenceCiv.push(0);
                    battle_no_change.push(0);
                }

                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].event_types.length; j++) {
                        // console.log(data[i].event_types[j]);
                        if (data[i].event_types[j] == "Strategic Development") {
                            strDev[i] += 1;
                            total_SD += 1;
                        } else if (data[i].event_types[j] == "Headquarters or base established") {
                            hq_base[i] += 1;
                            total_HQ += 1;
                        } else if (data[i].event_types[j] == "Battle-Non-state actor overtakes territory") {
                            battle_no_state[i] += 1;
                            total_BNS += 1;
                        } else if (data[i].event_types[j] == "Battle-Government regains territory") {
                            battle_gov[i] += 1;
                            total_BG += 1;
                        } else if (data[i].event_types[j] == "Non-violent transfer of territory") {
                            non_violent[i] += 1;
                            total_NV += 1;
                        } else if (data[i].event_types[j] == "Riots/Protests") {
                            riots[i] += 1;
                            total_R += 1;
                        } else if (data[i].event_types[j] == "Remote violence") {
                            remoteViol[i] += 1;
                            total_RV += 1;
                        } else if (data[i].event_types[j] == "Violence against civilians") {
                            violenceCiv[i] += 1;
                            total_VC += 1;
                        } else if (data[i].event_types[j] == "Battle-No change of territory") {
                            battle_no_change[i] += 1;
                            total_BNC += 1;
                        }
                    }
                }
                var strDev_range = 0,
                    hq_base_range = 0,
                    battle_no_state_range = 0,
                    battle_gov_range = 0,
                    non_violent_range = 0,
                    stratDev_range = 0,
                    riots_range = 0,
                    remoteViol_range = 0,
                    violenceCiv_range = 0,
                    battle_no_change_range = 0;

                for (var i = indexStart; i < indexend; i++) {
                    strDev_range += strDev[i];
                    hq_base_range += hq_base[i];
                    battle_no_state_range += battle_no_state[i];
                    battle_gov_range += battle_gov[i];
                    non_violent_range += non_violent[i];
                    stratDev_range += stratDev[i];
                    riots_range += riots[i];
                    remoteViol_range += remoteViol[i];
                    violenceCiv_range += violenceCiv[i];
                    battle_no_change_range += battle_no_change[i];
                }
                console.log(strDev_range);
                console.log(total_SD);
                console.log(strDev_range/total_SD)
                dash.strDev = (strDev_range/total_SD * 100 ).toFixed(1) || 0;
                dash.hq_base = (hq_base_range/total_HQ * 100).toFixed(1) || 0;
                dash.battle_no_state = (battle_no_state_range/total_BNS * 100).toFixed(1) || 0;
                dash.battle_gov = (battle_gov_range/total_BG * 100).toFixed(1) || 0;
                dash.non_violent = (non_violent_range/total_NV * 100).toFixed(1) || 0;
                dash.riots = (riots_range/total_R * 100).toFixed(1) || 0;
                dash.remoteViol = (remoteViol_range/total_RV * 100).toFixed(1) || 0;
                dash.violenceCiv = (violenceCiv_range/total_VC * 100).toFixed(1) || 0;
                dash.battle_no_change = (battle_no_change_range/total_BNC * 100).toFixed(1) || 0;
                //console.log(event_type[0]);
                var list = event_type[0];
                var numArray = Object.values(list);
                numArray = numArray.sort((a, b) => a - b);
                //console.log(numArray);
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
                        labels: dates.slice(indexStart, indexend + 1),
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
                            data: deaths.slice(indexStart, indexend + 1),
                            spanGaps: false,
                        }, {
                            type: 'line',
                            label: 'Number of Events',
                            data: events.slice(indexStart, indexend + 1),
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
                        labels: dates.slice(indexStart, indexend + 1),
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
                            data: events.slice(indexStart, indexend + 1),
                            spanGaps: false,
                        }]
                    }
                });
                var ctx6 = document.getElementById("individualEventChart");
                // dash.myLineChart = undefined;
                if (dash.myIndividualEventChart != undefined || dash.myIndividualEventChart != null) {
                    dash.myIndividualEventChart.destroy();
                }
                //console.log(strDev);
                //console.log(dash.myIndividualEventChart)
                dash.myIndividualEventChart = new Chart(ctx6, {
                    type: 'line',
                    data: {
                        labels: dates.slice(indexStart, indexend + 1),
                        datasets: [{
                            type: 'line',
                            label: 'Strategic Development',
                            data: strDev.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(150,0,0,.1)",
                            borderColor: "rgba(150,0,0,1)"
                        }, {
                            type: 'line',
                            label: 'Headquarters or base established',
                            data: hq_base.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(0,0,150,.1)",
                            borderColor: "rgba(0,0,150,1)"
                        }, {
                            type: 'line',
                            label: 'Battle-Non-state actor overtakes territory',
                            data: battle_no_state.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(0,150,0,.1)",
                            borderColor: "rgba(0,150,0,1)"
                        }, {
                            type: 'line',
                            label: 'Battle-Government regains territory',
                            data: battle_gov.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(150,150,0,.1)",
                            borderColor: "rgba(150,150,0,1)"
                        }, {

                            type: 'line',
                            label: 'Non-violent transfer of territory',
                            data: non_violent.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(0,0,0,0)",
                            borderColor: "rgba(150,150,150,1)"
                        }, {
                            type: 'line',
                            label: 'Riots and Protest',
                            data: riots.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(150,0,150,.1)",
                            borderColor: "rgba(150,0,150,1)"
                        }, {
                            type: 'line',
                            label: 'Remote Violence',
                            data: remoteViol.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(150,0,150,.1)",
                            borderColor: "rgba(75,0,0,.3)"
                        }, {
                            type: 'line',
                            label: 'Violence against civilians',
                            data: violenceCiv.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(0,75,0,.1)",
                            borderColor: "rgba(0,75,0,1)"
                        }, {
                            type: 'line',
                            label: 'Battle-No change of territory',
                            data: battle_no_change.slice(indexStart, indexend + 1),
                            backgroundColor: "rgba(0,0,75,.1)",
                            borderColor: "rgba(0,0,75,1)"

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

                });
            })
        }
        window.onload = dash.changeInput;
    }]);
