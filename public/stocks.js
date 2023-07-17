
    let stockChart;


    //import { Chart } from 'chart.js';
    //const annotationPlugin = require('chartjs-plugin-annotation');

    //Chart.register(annotationPlugin);

    function getStockData() {
        const stockSymbol = document.getElementById('stockInput').value;
        const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockSymbol}&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const monthlyTimeSeries = data['Monthly Time Series'];

                const annotations = {
                  drawTime: 'afterDatasetsDraw',
                  annotations: []
                };
                //const annotations = [];

                const binOfDates = ['2020-08-31', '2021-11-30', '2022-02-28'];

                
                // Convert data to Chart.js format
                const chartData = {
                    type: 'line',
                    labels: [],
                    datasets: [{
                        label: stockSymbol,
                        data: [],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };

                // Extract the past 5 years of monthly closing prices
                const dates = Object.keys(monthlyTimeSeries)
                    .sort()
                    .slice(-60);
                    //.reverse();
                    //.slice(0, 60); // 12 months * 5 years = 60 months

                dates.forEach(date => {
                    const closePrice = parseFloat(monthlyTimeSeries[date]['4. close']);
                    chartData.labels.push(date);
                    chartData.datasets[0].data.push(closePrice);
                });

               binOfDates.forEach(date => {
                const index = dates.indexOf(date);
                console.log(index)
                const index_price = chartData.datasets[0].data[index]
                if (index !== -1) {
                  annotations.annotations.push({
                    type: 'point',
                    //mode: 'vertical',
                    scaleID: 'x',
                    xValue: date,
                    yValue: index_price,
                    // borderColor: 'red',
                    // borderWidth: 2,
                    backgroundColor: 'rgba(255, 99, 132, 0.25)',
                    label: {
                      backgroundColor: 'red',
                      content: 'Marker',
                      enabled: true,
                      position: 'top'
                    }
                  });
                }
              });
               //console.log(annotations)

                updateStockChart(chartData, annotations);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateStockChart(data, annotations) {
        if (stockChart) {
            // If chart instance exists, update its data
            stockChart.data = data;
            stockChart.options.plugins.annotation.annotations = annotations.annotations;

            stockChart.update();
        } else {
            //console.log(annotations)
            // If chart instance doesn't exist, create a new chart
            const ctx = document.getElementById('stockChart').getContext('2d');
            //const ctx = document.getElementById('stockChart').getContext('2d');
            // const annotationCanvas = document.getElementById('annotationCanvas');
            // const annotationCtx = annotationCanvas.getContext('2d');
            console.log(annotations.annotations)
            stockChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    plugins: {
                        annotation: annotations
                    }
                }
            });
            // stockChart = new Chart(ctx, {
            //     data: data,
            //     options: {
            //         responsive: true,
            //         scales: {
            //             x: {
            //                 display: true
            //             },
            //             y: {
            //                 display: true
            //             }
            //         },
            //         plugins: {
            //             annotation: {
            //               annotations: {
            //                 line1: {
            //                     type: 'point',
            //                     xScaleID: 'x',
            //                     xValue: '2021-11-30',
            //                     yValue: 100,
            //                     backgroundColor: 'red'
            //                   // type: 'point',
            //                   // //scaleID: 'x',
            //                   // //value: 39,
            //                   // //xMax: '2021-11-30',
            //                   // backgroundColor: 'red',
            //                   // //borderColor: 'red',
            //                   // //borderWidth: 2,
            //                   // x_value: '2021-11-30',
            //                   // y_value: 100
            //                 }
            //               }
            //             }
            //           }
            //   //       plugins: {
            //   //       annotation: {
            //   //           drawTime: 'afterDatasetsDraw',
            //   //           annotations: annotations.annotations
            //   //   }
            //   // }
            //     }

      
                
            // });
            console.log(stockChart)
        }
    }


let searchChart;

function getSearchData() {
            const word = document.getElementById('wordInput').value;
            const rssUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=US`;

            const proxyUrl = 'http://localhost:3000/proxy';
            const apiUrl = `${proxyUrl}`;

            const params = {
                param1: word,
            };

            console.log(word)
            const options = {
                method: 'POST',
                 headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( params )  
            };

            fetch(apiUrl, options)
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    

                    newUpdateChart(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        function newUpdateChart(data) {

            if (searchChart) {
                searchChart.data = data;
                searchChart.update();
            }
            else {
                const ctx = document.getElementById('searchChart').getContext('2d');
                searchChart = new Chart(ctx, {
                  type: 'line',
                  data: data,
                  options: {
                    responsive: true,
                    scales: {
                      x: {
                        display: true,
                      },
                      y: {
                        display: true,
                      },
                    },
                  },
                })
              // .catch(error => {
              //   console.error('Error:', error);
              // });
            }
        }



