$(function() {

    function getDateFomat(startDate, endDate) {
        if (endDate.diff(startDate, 'hours', true) <= 2) {
            return "YYYY/MM/DD HH:mm"
        } else if (endDate.diff(startDate, 'days', true) <= 2) {
            return "YYYY/MM/DD HH:mm"
        } else if (endDate.diff(startDate, 'days', true) <= 62) {
            return "YYYY/MM/DD"
        } else {
            return "YYYY/MM"
        }
    }

    $('#node_select_pf').select2({
        minimumResultsForSearch: Infinity,
    });
    $('#node_select_pf').on('change', function() {
        fetch_data();
    });

    let dateformat = getDateFomat(moment().startOf('day'), moment());

    $('#all_apps').on('click', function() {
        const all_options = [];
        $('#app_select > option').each(function() {
            all_options.push($(this).val());
        })

        $('#app_select').val(all_options).trigger('change.select2');
        fetch_data();
    });

    $('#no_apps').on('click', function() {
        $('#app_select').val('data', null).trigger('change.select2');
        fetch_data();
    })

    const daterange_input = $('input[name="daterange"]').daterangepicker({
        format: 'MM/DD/YYYY HH:mm:ss',
        minDate: '01/01/1970',
        maxDate: '24/05/2020',
        startDate: moment().startOf('day'),
        endDate: moment(),
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Last 10 minutes': [moment().subtract(10, 'minutes'), moment()],
            'Last Hour': [moment().subtract(1, 'hour'), moment()],
            'Today': [moment().startOf('day'), moment()],
            'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1,
        },

        onSelect: function() {
            $("#daterange_input").val([start.valueOf(), end.valueOf()]);
            dateformat = getDateFomat(moment(start), moment(end));
            fetch_data();
        }
    }, function(start, end, label) {
        if (label === 'Custom') {
            $('#reportrange_logs').html('From ' + start.format('HH:mm a <b>MMMM D, YYYY</b>') + ' To ' + end.format('HH:mm a <b>MMMM D, YYYY</b>'));
        } else {
            $('#reportrange_logs').html(label);
        }
        dateformat = getDateFomat(moment(start), moment(end));
        fetch_data();
    });

    const noDataGraphic = {
        type: 'group',
        top: 'middle',
        left: 'center',
        width: 5,
        height: 5,
        z: 150,
        invisible: false,
        children: [{
                type: 'image',
                z: 90,
                left: 'center',
                top: 0,
                style: {
                    width: 50,
                    height: 50,
                    image: '/static/img/warning.png'
                },
            },
            {
                type: 'text',
                z: 100,
                left: 'center',
                top: 60,
                style: {
                    text: ["No data available",
                        "for this date range"
                    ].join("\n"),
                    textAlign: 'center',
                    font: 'bold 17px arial, sans-serif',
                    fill: '#FFA726',
                    lineWidth: 2,
                    shadowBlur: 8,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowColor: 'rgba(0,0,0,0.3)',
                },
            }
        ]
    };

    const charts = {
        'pf_traffic_in': {
            'chart': echarts.init(document.getElementById('traffic_in_chart')),
            'options': {
                title: {
                    text: 'Number of hits',
                    x: 'center'
                },
                tooltip: {
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            type: 'solid',
                            color: '#4488bb',
                            width: 2
                        }
                    }
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(params) {
                            return moment(new Date(params)).format(dateformat);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'hits',
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: 'requests',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: '#ff9d13'

                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#ff7011'
                        }
                    }
                }]
            }
        },
        'pf_traffic_out': {
            'chart': echarts.init(document.getElementById('traffic_out_chart')),
            'options': {
                title: {
                    text: 'Number of hits',
                    x: 'center'
                },
                tooltip: {
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            type: 'solid',
                            color: '#4488bb',
                            width: 2
                        }
                    }
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(params) {
                            return moment(new Date(params)).format(dateformat);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'hits',
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: 'requests',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: '#ff9d13'

                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#ff7011'
                        }
                    }
                }]
            }
        },
        'firewall_actions_in': {
            'chart': echarts.init(document.getElementById('action_in_chart')),
            'options': {
                title: {
                    text: 'Firewall Actions',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params.color + ';"></span>' + params.name + ' : ' + params.value + ' hits (' + params.percent + '%)'
                    }
                },
                series: [{
                    name: 'Firewall Actions',
                    type: 'pie',
                    radius: '55%',
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            }
        },
        'firewall_actions_out': {
            'chart': echarts.init(document.getElementById('action_out_chart')),
            'options': {
                title: {
                    text: 'Firewall Actions',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params.color + ';"></span>' + params.name + ' : ' + params.value + ' hits (' + params.percent + '%)'
                    }
                },
                series: [{
                    name: 'Firewall Actions',
                    type: 'pie',
                    radius: '55%',
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            }
        },
        'top_ports_in': {
            'chart': echarts.init(document.getElementById('ports_in_chart')),
            'options': {
                title: {
                    text: 'Requests per destination ports',
                    subtextStyle: {
                        color: "#39454c",
                        fontSize: 14
                    },
                    subtext: 'top 20',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        let text = 'port ' + params[0].name;
                        for (serie of params) {
                            text += '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + serie.color + ';"></span>' + serie.seriesName + ': ' + serie.data + ' hits';
                        }
                        return text;
                    }
                },
                legend: {
                    x: 'right',
                    data: ['block', 'pass']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name: 'hits',
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    type: 'category'
                },
                series: [{
                        name: 'block',
                        type: 'bar'
                    },
                    {
                        name: 'pass',
                        type: 'bar'
                    }
                ]
            }
        },
        'top_ports_out': {
            'chart': echarts.init(document.getElementById('ports_out_chart')),
            'options': {
                title: {
                    text: 'Requests per destination ports',
                    subtext: 'top 20',
                    subtextStyle: {
                        color: "#39454c",
                        fontSize: 14
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        var text = 'port ' + params[0].name;
                        params.forEach(serie => {
                            text += '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + serie.color + ';"></span>' + serie.seriesName + ': ' + serie.data + ' hits';
                        })
                        return text;
                    }
                },
                legend: {
                    x: 'right',
                    data: ['block', 'pass']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name: 'hits',
                    boundaryGap: [0, 0.01]
                },
                xAxis: {
                    type: 'category'
                },
                series: [{
                        name: 'block',
                        type: 'bar'
                    },
                    {
                        name: 'pass',
                        type: 'bar'
                    }
                ]
            }
        },
        'top_ip_src_in': {
            'chart': echarts.init(document.getElementById('top_ip_src_in_chart')),
            'options': {
                title: {
                    text: 'Source IP',
                    subtext: 'top 100',
                    subtextStyle: {
                        color: "#39454c",
                        fontSize: 14
                    },
                    x: 'center'
                },
                color: ["#FFC312"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: false
                        }
                    },
                    formatter: function(params) {
                        return params[0].name + '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + ';"></span>' + params[0].data + ' hits'
                    }
                },
                calculable: true,
                grid: {
                    top: "20%",
                    left: '1%',
                    right: '1%',
                    bottom: "10%",
                    containLabel: true
                },
                xAxis: [{
                    type: 'category'
                }],
                yAxis: [{
                    type: 'value',
                    name: 'hits'
                }],
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }],
                series: [{
                    type: 'bar',
                }]
            }
        },
        'top_ip_src_out': {
            'chart': echarts.init(document.getElementById('top_ip_src_out_chart')),
            'options': {
                title: {
                    text: 'Source IP',
                    subtext: 'top 100',
                    subtextStyle: {
                        color: "#39454c",
                        fontSize: 14
                    },
                    x: 'center'
                },
                color: ["#FFC312"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: false
                        }
                    },
                    formatter: function(params) {
                        return params[0].name + '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + ';"></span>' + params[0].data + ' hits'
                    }
                },
                calculable: true,
                grid: {
                    top: "20%",
                    left: '1%',
                    right: '1%',
                    bottom: "10%",
                    containLabel: true
                },
                xAxis: [{
                    type: 'category'
                }],
                yAxis: [{
                    type: 'value',
                    name: 'hits'
                }],
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }],
                series: [{
                    type: 'bar',
                    tooltip: {
                        formatter: "{b} : {c} hits"
                    }
                }]
            }
        },
        'top_ip_dst_in': {
            'chart': echarts.init(document.getElementById('top_ip_dst_in_chart')),
            'options': {
                title: {
                    text: 'Destination IP',
                    subtext: 'top 100',
                    subtextStyle: {
                        color: "#39454c",
                        fontSize: 14
                    },
                    x: 'center'
                },
                color: ["#FFC312"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: false
                        }
                    },
                    formatter: function(params) {
                        return params[0].name + '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + ';"></span>' + params[0].data + ' hits'
                    }
                },
                calculable: true,
                grid: {
                    top: "20%",
                    left: '1%',
                    right: '1%',
                    bottom: "10%",
                    containLabel: true
                },
                xAxis: [{
                    type: 'category'
                }],
                yAxis: [{
                    type: 'value',
                    name: 'hits'
                }],
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }],
                series: [{
                    type: 'bar',
                    tooltip: {
                        formatter: "{b} : {c} hits"
                    }
                }]
            }
        },
        'top_ip_dst_out': {
            'chart': echarts.init(document.getElementById('top_ip_dst_out_chart')),
            'options': {
                title: {
                    text: 'Destination IP',
                    subtext: 'top 100',
                    subtextStyle: {
                        color: "#39454c",
                        fontSize: 14
                    },
                    x: 'center'
                },
                color: ["#FFC312"],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: false
                        }
                    },
                    formatter: function(params) {
                        return params[0].name + '<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + ';"></span>' + params[0].data + ' hits'
                    }
                },
                calculable: true,
                grid: {
                    top: "20%",
                    left: '1%',
                    right: '1%',
                    bottom: "10%",
                    containLabel: true
                },
                xAxis: [{
                    type: 'category'
                }],
                yAxis: [{
                    type: 'value',
                    name: 'hits'
                }],
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }],
                series: [{
                    type: 'bar',
                    tooltip: {
                        formatter: "{b} : {c} hits"
                    }
                }]
            }
        }

    }

    for (const chart_name of Object.keys(charts)) {
        const values = charts[chart_name];
        values.chart.setOption(values.options);
        values.chart.setOption({
            graphic: noDataGraphic
        });
    }

    function fetch_data() {
        const apps = $("#app_select").val();
        const date = {
            'startDate': daterange_input.data('daterangepicker').startDate,
            'endDate': daterange_input.data('daterangepicker').endDate
        };

        $(".fa-spinner").show("fast");


        $.post(
            '/reporting/data/', {
                'apps': JSON.stringify(apps),
                'daterange': JSON.stringify(date),
                'reporting_type': "packet_filter",
                'node': $('#node_select_pf').val().split('|')[0],
                'type_repo': $('#node_select_pf').val().split('|')[1],
            },

            function(response) {
                if (typeof(response) === 'string') {
                    window.location.href = window.location.href;
                    return;
                }

                if (typeof(response.results) === 'string') {
                    let errorGraphic = $.extend(true, {}, noDataGraphic);
                    errorGraphic.children[1].style.text = response.results;

                    for (const chart_name of Object.keys(charts)) {
                        const values = charts[chart_name];
                        values.chart.clear()
                        values.chart.setOption(values.options);
                        values.chart.setOption({
                            graphic: errorGraphic
                        });
                    }

                    $(".fa-spinner").hide();
                    return;
                }

                if (!jQuery.isEmptyObject(response.errors)) {
                    for (const err of response.errors){
                        new PNotify({
                            title: 'Error',
                            text: err,
                            type: 'error',
                            styling: 'bootstrap3',
                            nonblock: {
                                nonblock: true
                            }
                        });
                    }
                }

                for (const result of Object.keys(response.results)) {
                    const values = response.results[result];

                    let options = {
                        graphic: noDataGraphic
                    };
                    let data = [];

                    if (!jQuery.isEmptyObject(values)) {
                        if (result.startsWith('pf_traffic')) {
                            for (const item of values) {
                                const date = new Date(item.name);
                                data.push({
                                    name: date.toString(),
                                    value: [date, item.value]
                                });
                            }
                        } else if (result.startsWith('top_ip')) {
                            const ipList = [];
                            for (const item of values) {
                                data.push(item.value)
                                ipList.push(item.name)
                            }

                            options.xAxis = [{
                                data: ipList
                            }]

                        } else if (result.startsWith('top_ports')) {
                            const ports = [];
                            const passData = [];
                            const blockData = [];

                            for (const port of values) {
                                for (const item of port.value) {
                                    if (item.name === 'pass') {
                                        passData.push(item.value)
                                    } else if (item.name === 'block') {
                                        blockData.push(item.value)
                                    }
                                }
                                ports.push(port.name)
                            }

                            options.series = [{
                                data: blockData
                            }, {
                                data: passData
                            }];

                            options.xAxis = [{
                                data: ports
                            }];
                        } else {
                            data = values.map(item => {
                                return {
                                    name: item.name,
                                    value: item.value,
                                    itemStyle: {
                                        normal: {
                                            color: item.name === 'pass' ? '#2f4554' : '#c23531'
                                        }
                                    }
                                }
                            });
                        }
                        for (const children of options.graphic.children) {
                            children.invisible = true;
                        }

                    } else {
                        for (const children of options.graphic.children) {
                            children.invisible = false;
                        }
                    }

                    if (!result.startsWith("top_ports")) {
                        options.series = [{
                            data: data
                        }];
                    }


                    charts[result].chart.clear();
                    charts[result].chart.setOption(charts[result].options);
                    charts[result].chart.setOption(options);

                }
                $(".fa-spinner").hide();
            });

    }
    if ($('#node_select_pf')[0].options.length <= 0) {
        new PNotify({
            title: 'Error',
            text: "No data repository available",
            type: 'error',
            styling: 'bootstrap3',
            nonblock: {
                nonblock: true
            }
        });
        $('input[name="daterange"]').daterangepicker();
        $(".fa-spinner").hide();
    } else {
        fetch_data();
    }
});
