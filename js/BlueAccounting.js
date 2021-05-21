function BlueAccounting(){
    this.ColorPicker = {
        heading1: '#2271a2', //getColor(34, 113, 162),
        heading2: '#314766', //getColor(49, 71, 102),
        heading3: '#2271a2', //getColor(34, 113, 162),
        heading4: '#2271a2', //getColor(34, 113, 162),
        heading5: '#333333', //getColor(51, 51, 51),
        heading6: '#314766', //getColor(49, 71, 102),
        body: '#333333', //getColor(51, 51, 51),
        body_resource: '#333333', //getColor(51, 51, 51),

        blue_header: '#2b4e7c', //getColor(43, 78, 124),
        green_selection_whtbg: '#6db227', //getColor(109, 178, 39),
        green_selection_dkbg: '#b8e986', //getColor(184, 233, 134),
        orange_selection: '#f7b141', //getColor(247, 177, 65),
        grey_menu: '#dddddd', //getColor(221, 221, 221),
        infographic_bg: '#d8e2db', //getColor(216, 226, 235),
        slideshow_arrow: '#9b9b9b', //getColor(155, 155, 155),

        blue1: '#1c2d5a', //getColor(28, 45, 90),
        blue2: '#afdfe4', //getColor(175, 223, 228),
        blue3: '#7eb4d2', //getColor(126, 111, 247),
        blue4: '#7ed3f7', //getColor(126, 211, 247),
        blue5: '#188ccc', //getColor(24, 140, 204),
        blue6: '#00b0e6', //getColor(0, 176, 230),
        blue7: '#1b75ba', //getColor(30, 117, 186),

        target_red: '#ff0000', //getColor(206, 0, 0),

        // Distinctive colors, with no blues. For shades of blues, refer to blue1 - blue7.
        red: '#e6194B',
        green: '#3cb44b',
        yellow: '#ffe119',
        orange: '#f58231',
        purple: '#911eb4',
        magenta: '#f032e6',
        lime: '#bfef45',
        pink: '#fabebe',
        teal: '#469990',
        lavender: '#e6beff',
        brown: '#9A6324',
        beige: '#fffac8',
        maroon: '#800000',
        ming: '#aaffc3',
        olive: '#808000',
        apricot: '#ffd8b1',
        grey: '#a9a9a9',
        white: '#ffffff',
        black: '#333333'
    };

    this.init = function () {
        Highcharts.Chart.prototype.viewData = function () {
            if (!this.insertedTable) {
                var div = document.createElement('div');
                div.className = 'highcharts-data-table';
                // Insert after the chart container
                this.renderTo.parentNode.insertBefore(div, this.renderTo.nextSibling);
                div.innerHTML = this.getTable();
                this.insertedTable = true;
                var date_str = new Date().getTime().toString();
                var rand_str = Math.floor(Math.random() * (1000000)).toString();
                this.insertedTableID = 'div_' + date_str + rand_str
                div.id = this.insertedTableID;
            }
            else {
                $('#' + this.insertedTableID).toggle();
            }
        };
    };

    this.Maritime = {};

    this.Coastal = {};

    this.SourceWater = {};

    this.buildSingleChart = function (type, series, seriesName, seriesUnit, color, startingYear, title, subtitle, desc, target, tag, cap, height, width, xAxis_title) {
        var chart = Highcharts.chart(tag, {
            chart: {
                background: "transparent",
                type: type,
                width: width,
                height: height,
                style: {
                    color: this.ColorPicker.body
                },
                accessibility: { 
                    description: desc 
                },
                events: {
                    load: function () {
                        var logoX = 15;
                        var size = this.plotBox.y;
                        size -= 40;

                        if(this.chartWidth < 500){
                            logoX = 10;
                        }
                        var img_width = (this.chartWidth - 350)/2 - logoX;
                        var img_height = size;
                        if(img_width >= img_height*4){
                            // wide logo. local resource
                            this.renderer.image("https://c1.staticflickr.com/1/826/26966705327_f80fcd7af1_o.png", logoX, 0, size * 4, size ).add();
                            // ErieStat logo. Change factor to 3
                            // this.renderer.image("https://c1.staticflickr.com/1/956/27966542108_a46fd4fa96_o.png", logoX, 0, size*3 , size).add();
                        }else{
                            // cube logo
                            this.renderer.image("https://c1.staticflickr.com/1/868/40969378165_8bd2c065b9_o.png", logoX, 0, size, size).add();
                        }
                        // var w = this.chartWidth - this.title.alignAttr.x;
                        // Blue Accounting Cube logo
                        // this.renderer.image("https://c1.staticflickr.com/1/868/40969378165_8bd2c065b9_o.png", logoX, 0, size, size).add();
                        // Blue Accouting Logo
                        // this.renderer.image("https://c1.staticflickr.com/1/826/26966705327_f80fcd7af1_o.png", logoX, 0, size * 4, size ).add();
                        // Blue Accounting ErieStat Logo
                        // this.renderer.image("https://c1.staticflickr.com/1/956/27966542108_a46fd4fa96_o.png", logoX, 0, size*3 , size).add();

                        // this.renderer.image("https://c1.staticflickr.com/5/4382/36578347693_3c6032000b_o.png", 0, 0, chart_width, chart_height).add();   //red watermark
                        // if (isBgImg) {
                        //     this.renderer.image("img/background_draft.png", this.plotLeft, this.plotTop, this.plotWidth, this.plotHeight).add(); //grey watermark
                        // }
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: true
            },
            title: {
                text: title,
                margin: 20,
                widthAdjust: -330,
                style: {
                    color: '#000000',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                text: subtitle
            },
            yAxis: {
                title: {
                    text: seriesUnit ? seriesName + "<br>(" + seriesUnit + ")" : seriesName,
                    style: {
                        color: color
                    }
                },
                min: 0
            },
            xAxis: {
                title: {
                    text: xAxis_title
                }
            },
            legend: {
                symbolHeight: 11,
                symbolWidth: 11,
                symbolRadius: 0,
                itemMarginBottom: 8,
                itemStyle: {
                    "word-wrap": "break-word",
                    fontWeight: 'normal'
                }
            },
            caption: {
                text: cap
            },
            
            plotOptions: {
                series: {
                    pointStart: startingYear
                },
                groupPadding: 0.1,
            },
            series: [
                {
                    name: seriesName,
                    data: series,
                    color: color
                }
            ]
        });
        if (target) {
            this.addTargetLine(chart, target, seriesName + " Target");
        }

        return chart;
    };

    this.buildDualAxesChart = function (series1, seriesName1, seriesUnit1, color1, chartType1,
                                        series2, seriesName2, seriesUnit2, color2, chartType2,
                                        tag, title, subtitle, desc, startingYear, target1, target2, cap, height, width, xAxis_title) {

        var chart;
        if (!series1) {
            seriesName1 += " (not available)";
        }
        if (!series2) {
            seriesName2 += " (not available)";
        }

        chart = Highcharts.chart(tag, {
            chart: {
                height: height,
                width: width,
                style: {
                    color: this.ColorPicker.body
                },
                accessibility: { 
                    description: desc 
                },
                events: {
                    load: function () {
                        var logoX = 15;
                        var size = this.plotBox.y;
                        size -= 40;

                        if(this.chartWidth < 500){
                            logoX = 10;
                        }
                        var img_width = (this.chartWidth - 350)/2 - logoX;
                        // var img_height = size;
                        if(img_width >= size * 4){
                            // wide logo
                            this.renderer.image("https://c1.staticflickr.com/1/826/26966705327_f80fcd7af1_o.png", logoX, 0, size * 4, size ).add();
                            // ErieStat logo. Change factor to 3
                            // this.renderer.image("https://c1.staticflickr.com/1/956/27966542108_a46fd4fa96_o.png", logoX, 0, size*3 , size).add();
                        }else{
                            // cube logo
                            this.renderer.image("https://c1.staticflickr.com/1/868/40969378165_8bd2c065b9_o.png", logoX, 0, size, size).add();
                        }
                        // var w = this.chartWidth - this.title.alignAttr.x;
                        // Blue Accounting Cube logo
                        // this.renderer.image("https://c1.staticflickr.com/1/868/40969378165_8bd2c065b9_o.png", logoX, 0, size, size).add();
                        // Blue Accouting Logo
                        // this.renderer.image("https://c1.staticflickr.com/1/826/26966705327_f80fcd7af1_o.png", logoX, 0, size * 4, size ).add();
                        // Blue Accounting ErieStat Logo
                        // this.renderer.image("https://c1.staticflickr.com/1/956/27966542108_a46fd4fa96_o.png", logoX, 0, size*3 , size).add();

                        // this.renderer.image("https://c1.staticflickr.com/5/4382/36578347693_3c6032000b_o.png", 0, 0, chart_width, chart_height).add();   //red watermark
//                if (isBgImg) {
//                    this.renderer.image("img/background_draft.png", this.plotLeft, this.plotTop, this.plotWidth, this.plotHeight).add(); //grey watermark
//                }
                    }
                }
            },
            title: {
                text: title,
                margin: 20,
                widthAdjust: -330,
                style: {
                    color: this.ColorPicker.body,
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                text: subtitle
            },
            credits: {
                enabled: false,
            },
            xAxis: [{
                title: {
                    text: xAxis_title
                }
            }],
            yAxis: [{ // Primary yAxis
                title: {
                    text: seriesUnit1 ? seriesName1 + "<br>(" + seriesUnit1 + ")" : seriesName1,
                    style: {
                        color: color1
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: seriesUnit2 ? seriesName2 + "<br>(" + seriesUnit2 + ")" : seriesUnit2,
                    style: {
                        color: color2
                    }
                },
                min: 0,
                opposite: true
            }],
            legend: {
                symbolHeight: 11,
                symbolWidth: 11,
                symbolRadius: 0,
                itemMarginBottom: 8,
                itemStyle: {
                    "word-wrap": "break-word",
                    fontWeight: 'normal'
                }
            },
            caption: {
                text: cap
            },
            
            plotOptions: {
                series: {
                    pointStart: startingYear
                }
            },
            series: [{
                name: seriesName1,
                type: chartType1,
                unit: seriesUnit1,
                data: series1,
                color: color1
            }, {
                name: seriesName2,
                type: chartType2,
                yAxis: 1,
                unit: seriesUnit2,
                data: series2,
                color: color2,
                // visible: isSeriesVisible(s2_visible)
            }]
        });

        if (target1) {
            this.addTargetLine(chart, target1, seriesName1 + " Target");
        }
        if (target2) {
            this.addTargetLine(chart, target2, seriesName2 + " Target", "shortdot");
        }

        return chart;
    };

    this.addTargetLine = function (chart, target, targetTitle, lineStyle) {
        var targetSeries = [];
        chart.series[0].data.map(function() {
            targetSeries.push(target);
        });

        chart.addSeries({
            type: 'line',
            data: targetSeries,
            name: targetTitle ,
            color: '#E07000',
            lineWidth: 3,
            marker: {
                radius: 0
            },
            dashStyle: lineStyle
        })
    };

    this.buildStockChart = function (tag, title, xTitle, yTitle, data_series, height, width){
        return Highcharts.stockChart(tag, {
            chart:{
                height: height,
                width: width,
                events: {
                    load: function () {
                        var logoX = 15;
                        var size = this.plotBox.y;
                        size -= 40;

                        if(this.chartWidth < 500){
                            logoX = 10;
                        }
                        var img_width = (this.chartWidth - 350)/2 - logoX;
                        var img_height = size - 35;
                        if(img_width >= img_height*4){
                            // wide logo. local resource
                            this.renderer.image("https://c1.staticflickr.com/1/826/26966705327_f80fcd7af1_o.png", logoX, 0, img_height * 4, img_height ).add();
                            // ErieStat logo. Change factor to 3
                            // this.renderer.image("https://c1.staticflickr.com/1/956/27966542108_a46fd4fa96_o.png", logoX, 0, size*3 , size).add();
                        }else{
                            // cube logo
                            this.renderer.image("https://c1.staticflickr.com/1/868/40969378165_8bd2c065b9_o.png", logoX, 0, img_height, img_height).add();
                        }
                        // var w = this.chartWidth - this.title.alignAttr.x;
                        // Blue Accounting Cube logo
                        // this.renderer.image("https://c1.staticflickr.com/1/868/40969378165_8bd2c065b9_o.png", logoX, 0, size, size).add();
                        // Blue Accouting Logo
                        // this.renderer.image("https://c1.staticflickr.com/1/826/26966705327_f80fcd7af1_o.png", logoX, 0, size * 4, size ).add();
                        // Blue Accounting ErieStat Logo
                        // this.renderer.image("https://c1.staticflickr.com/1/956/27966542108_a46fd4fa96_o.png", logoX, 0, size*3 , size).add();

                        // this.renderer.image("https://c1.staticflickr.com/5/4382/36578347693_3c6032000b_o.png", 0, 0, chart_width, chart_height).add();   //red watermark
                        // if (isBgImg) {
                        //     this.renderer.image("img/background_draft.png", this.plotLeft, this.plotTop, this.plotWidth, this.plotHeight).add(); //grey watermark
                        // }
                    }
                }
            },
            rangeSelector: {
                selected: 5
            },
            tooltip: {
                dateTimeLabelFormats: {
                    // second: '%Y-%m-%d<br/>%H:%M:%S',
                    minute: '%Y-%m-%d<br/>%H:%M',
                    hour: '%Y-%m-%d<br/>%H:%M',
                    day: '%Y<br/>%m-%d',
                    week: '%Y<br/>%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            credits: {
                enabled:false
            },
            legend: {
                enabled: true
            },
            title: {
                text: title,
                margin: 20,
                widthAdjust: -330,
                style: {
                    color: this.ColorPicker.body,
                    fontWeight: 'bold'
                }
            },

            xAxis: {
                title: {
                    enabled: true,
                    text: xTitle
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: yTitle
                }
            },
            series: data_series
        })
    }
}
