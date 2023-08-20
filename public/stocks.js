
    let stockChart;
    let searchChart;


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

                //const binOfDates = ['2020-08-31', '2021-11-30', '2022-02-28'];


                
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
                binOfDates = find_peaks(dates, chartData.datasets[0].data, 5)

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

    function find_peaks(xValues, yValues, threshold) {
        // console.log(xValues)
        // console.log(yValues)
        all_peaks = []
        all_dates = []
        max = 0
        max_idx = -1

        for (let i = 0; i < xValues.length; i++) {
            if(i == 0 || i == xValues.length -1) {
                continue
            }
            middle = yValues[i]
            first = yValues[i-1]
            last = yValues[i+1]

            if(middle > max){
                max = middle
                max_idx = i
            }

            if(middle > first + threshold && middle > last + threshold){
                //console.log(middle + " is a peak " + first + " and " + last + " are lower than it")
                all_peaks.push(i)
            }
        }
        all_peaks.forEach(peak => {
            all_dates.push(xValues[peak])
        })
        if(! all_peaks.includes(max_idx)){
            all_dates.push(xValues[max_idx])
        }
        //console.log(all_dates)
        return all_dates
    }

    function updateStockChart(data, annotations) {
        if (stockChart) {
            // If chart instance exists, update its data
            stockChart.data = data;
            stockChart.options.plugins.annotation.annotations = annotations.annotations;
            if(searchChart) {
                    document.getElementById('compareButton').style.display = 'block';
                }

            stockChart.update();
        } else {
            if(searchChart) {
                document.getElementById('compareButton').style.display = 'block';
            }
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
    
            console.log(stockChart)
        }
    }




function getSearchData() {
            const word = document.getElementById('wordInput').value;
            const rssUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=US`;

            const proxyUrl = 'http://localhost:3000/proxy';
            const apiUrl = `${proxyUrl}`;

            const params = {
                param1: word,
            };

            const annotations = {
                  drawTime: 'afterDatasetsDraw',
                  annotations: []
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
                    xValues = data.labels
                    yValues = data.datasets[0].data
                    console.log(xValues)
                    console.log(yValues)
                    binOfDates = find_peaks(xValues, yValues, 5)

                    binOfDates.forEach(date => {
                        const index = xValues.indexOf(date);
                        const index_price = yValues[index]
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

                    newUpdateChart(data, annotations);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        function newUpdateChart(data, annotations) {

            if (searchChart) {
                searchChart.data = data;
                searchChart.options.plugins.annotation.annotations = annotations.annotations;
                if(stockChart) {
                    document.getElementById('compareButton').style.display = 'block';
                }
                searchChart.update();
            }
            else {
                if(stockChart) {
                    document.getElementById('compareButton').style.display = 'block';
                }
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
                    plugins: {
                        annotation: annotations
                    }
                  },
                })
              // .catch(error => {
              //   console.error('Error:', error);
              // });
            }
        }

function compareData() {
    // Your comparison logic here
    // For example, you can update the stock data with a different stock's data and annotations
    // Then call updateStockChart again
    console.log("Comparing Data")
}



