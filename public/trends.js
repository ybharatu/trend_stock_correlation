let searchChart;

function getSearchData() {
            const word = document.getElementById('wordInput').value;
            const rssUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=US`;

            const proxyUrl = 'http://localhost:3000/proxy';
            const apiUrl = `${proxyUrl}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    

                    newUpdateChart(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        function renderChart(data) {
            const ctx = document.getElementById('searchChart').getContext('2d');
            const searchChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true
                        },
                        y: {
                            display: true,
                            suggestedMax: 1,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        function updateChart(data) {

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
                                display: true
                            },
                            y: {
                                display: true,
                                suggestedMax: 1,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }
                });
            }
        }
        function newUpdateChart(data) {

            if (searchChart) {
                searchChart.data = data;
                searchChart.update();
            }
            else {
                const ctx = document.getElementById('searchChart').getContext('2d');
                const searchChart = new Chart(ctx, {
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
              .catch(error => {
                console.error('Error:', error);
              });
            }
        }