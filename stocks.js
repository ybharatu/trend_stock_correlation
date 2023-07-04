
    let stockChart;

    function getStockData() {
        const stockSymbol = document.getElementById('stockInput').value;
        const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockSymbol}&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const monthlyTimeSeries = data['Monthly Time Series'];

                // Convert data to Chart.js format
                const chartData = {
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

                updateChart(chartData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function renderChart(data) {
        const ctx = document.getElementById('stockChart').getContext('2d');
        const stockChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true
                    },
                    y: {
                        display: true
                    }
                }
            }
        });
    }

    function updateChart(data) {
        if (stockChart) {
            // If chart instance exists, update its data
            stockChart.data = data;
            stockChart.update();
        } else {
            // If chart instance doesn't exist, create a new chart
            const ctx = document.getElementById('stockChart').getContext('2d');
            stockChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true
                        },
                        y: {
                            display: true
                        }
                    }
                }
            });
        }
    }






