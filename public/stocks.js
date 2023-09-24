
    let stockChart;
    let searchChart;
    let stock_x;
    let stock_y;
    let search_x;
    let search_y;
    let search_max =[];
    const monthAbbreviations = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};


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
                stock_x = dates
                stock_y = chartData.datasets[0].data

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
               console.log(chartData)

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
            search_max = []
            const word = document.getElementById('wordInput').value;
            const rssUrl = `https://trends.google.com/trends/trendingsearches/monthly/rss?geo=US`;

            const proxyUrl = 'http://localhost:3000/proxy';
            const apiUrl = `${proxyUrl}`;

            const params = {
                param1: word,
            };

            const annotations = {
                  drawTime: 'afterDatasetsDraw',
                  annotations: []
                };

            //console.log(word)
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
                    search_x = xValues
                    search_y = yValues

                    binOfDates.forEach(date => {
                        const index = xValues.indexOf(date);
                        const index_price = yValues[index]
                        if (index !== -1) {
                          convert_date(date)
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
            console.log(annotations)
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

// Calculate the mean (average) of an array
function calculateMean(data) {
    return data.reduce((sum, value) => sum + value, 0) / data.length;
}

// Calculate the correlation coefficient
function calculateCorrelation(data1, data2) {
    const mean1 = calculateMean(data1);
    const mean2 = calculateMean(data2);

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < data1.length; i++) {
        const deviation1 = data1[i] - mean1;
        const deviation2 = data2[i] - mean2;

        numerator += deviation1 * deviation2;
        denominator1 += deviation1 ** 2;
        denominator2 += deviation2 ** 2;
    }

    const correlation = numerator / Math.sqrt(denominator1 * denominator2);

    return correlation;
}

function resampleAndAggregate(data, expectedLength, aggregationFunction) {
    const resampledData = [];
    const chunkSize = Math.ceil(data.length / expectedLength);

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const aggregatedValue = aggregationFunction(chunk);
        resampledData.push(aggregatedValue);
    }

    return resampledData;
}

// Aggregation function to calculate the average value
function calculateAverage(values) {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
}


function compareData() {
    // Your comparison logic here
    // For example, you can update the stock data with a different stock's data and annotations
    // Then call updateStockChart again
       const annotations = {
                  drawTime: 'afterDatasetsDraw',
                  annotations: []
                };

    console.log(stock_x)
    for (let i = 0; i < search_max.length; i++) {
      element = search_max[i];
      console.log(element);
      index = stock_x.findIndex(item => item.includes(element));
      if(index >= 0){
            date = stock_x[index]
          index_price = stock_y[index]
          annotations.annotations.push({
                                type: 'point',
                                //mode: 'vertical',
                                scaleID: 'x',
                                xValue: date,
                                yValue: index_price,
                                // borderColor: 'red',
                                // borderWidth: 2,
                                backgroundColor: 'rgba(132, 99, 255, 0.25)',
                                label: {
                                  backgroundColor: 'green',
                                  content: 'Marker',
                                  enabled: true,
                                  position: 'top'
                                }
                              });
      }
      
    }
    updateStockChart(stockChart.data, annotations)
    
//     console.log("Comparing Data")
//     resampledData = resampleAndAggregate(search_y, stock_y.length, calculateAverage);
//     console.log("Resample Data: " + resampledData)
//     console.log("Length = " + resampledData.length)
//     console.log(stock_y.length)
//     const correlationCoefficient = calculateCorrelation(stock_y, resampledData);
//     console.log(`Correlation coefficient: ${correlationCoefficient}`);
 }

function convert_date(date) {
    //console.log("Current Date: " + date)
    words = date.split(/\s+/);
    console.log(words)
    new_date = words[words.length - 1] + "-" + monthAbbreviations[words[0]]
    console.log(new_date)
    search_max.push(new_date)
}



