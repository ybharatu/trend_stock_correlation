function getSearchData() {
            const word = document.getElementById('wordInput').value;
            const rssUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=US`;
            fetch(rssUrl)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, 'text/xml');
                    const items = xmlDoc.getElementsByTagName('item');

                    const chartData = {
                        labels: [],
                        datasets: [{
                            label: 'Search Frequency',
                            data: [],
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    };

                    for (let i = 0; i < items.length; i++) {
                        const title = items[i].getElementsByTagName('title')[0].textContent;
                        const pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
                        const date = new Date(pubDate).toLocaleDateString('en-US');
                        const searchFrequency = title.toLowerCase().includes(word.toLowerCase()) ? 1 : 0;

                        chartData.labels.push(date);
                        chartData.datasets[0].data.push(searchFrequency);
                    }

                    renderChart(chartData);
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