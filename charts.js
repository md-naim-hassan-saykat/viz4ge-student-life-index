// charts.js - Uses global 'studentData' from data.js

// Theme Configuration
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
Chart.defaults.font.family = "'Quicksand', sans-serif";
Chart.defaults.scale.grid.color = 'rgba(255,255,255,0.02)';

const COLORS = {
    default: 'rgba(148, 163, 184, 0.5)',
    highlight: '#f59e0b', // Gold
    secondary: '#06b6d4', // Cyan
    accent: '#ef4444',    // Red
    bg: '#1e293b'
};

let charts = {};
let selectedCountryCode = null;
let worldGeoJSON = null; // Store fetched GeoJSON

document.addEventListener('DOMContentLoaded', function () {
    renderMetrics();
    renderAllCharts();
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(res => res.json())
        .then(data => worldGeoJSON = data)
        .catch(err => console.error("GeoJSON Load Error:", err));
});

// ---------------- 1. Global State Management ----------------

// Called by p5.js sketches or chart clicks
window.updateRadarChart = function (countryCode) {
    selectCountry(countryCode);
};

function selectCountry(countryCode) {
    if (selectedCountryCode === countryCode) return; // No change
    selectedCountryCode = countryCode;

    // A. Update UI
    renderMetrics(countryCode);
    showOverlay(countryCode);

    // B. Highlight Charts
    highlightChart(charts.bar, countryCode);
    highlightChart(charts.efficiency, countryCode);
    highlightChart(charts.ratio, countryCode);
    highlightScatter(charts.scatter, countryCode);
    highlightScatter(charts.bubble, countryCode);

    // C. Update Drill-downs (Radar, Polar)
    updateDrillDowns(countryCode);
}

// ---------------- 2. Visual Updates ----------------

function highlightChart(chart, countryCode) {
    if (!chart) return;
    const labels = chart.data.labels;
    // Reset background colors
    const newColors = labels.map(label =>
        label === countryCode ? COLORS.highlight : COLORS.default
    );
    chart.data.datasets[0].backgroundColor = newColors;
    chart.update();
}

function highlightScatter(chart, countryCode) {
    if (!chart) return;
    // For scatter, we need to find index or map colors based on data
    const data = chart.data.datasets[0].data;
    const newColors = data.map(d =>
        d.country === countryCode ? COLORS.highlight : COLORS.secondary
    );
    const newRadii = data.map(d =>
        d.country === countryCode ? 10 : 6
    );

    chart.data.datasets[0].pointBackgroundColor = newColors;
    chart.data.datasets[0].pointRadius = newRadii;
    chart.data.datasets[0].backgroundColor = newColors; // Fallback
    chart.update();
}

function updateDrillDowns(countryCode) {
    const country = studentData.find(d => d.Country === countryCode);

    // Radar
    if (charts.radar) {
        let visualCost = Math.min(country.HousingCosts / 100, 100);
        const newData = [
            country.Work, country.Study, country.Happiness * 10,
            visualCost, country.MentalHealth, country.PerformIndex * 100
        ];

        if (charts.radar.data.datasets.length < 2) {
            charts.radar.data.datasets.push({
                label: countryCode,
                data: newData,
                fill: true,
                backgroundColor: 'rgba(6, 182, 212, 0.4)',
                borderColor: '#06b6d4'
            });
        } else {
            charts.radar.data.datasets[1].label = countryCode;
            charts.radar.data.datasets[1].data = newData;
        }
        charts.radar.update();
        document.getElementById('radar-insight').innerHTML = `Comparing <span style="color:#06b6d4">${countryCode}</span> vs Global Average.`;
    }

    // Polar
    if (charts.polar) {
        charts.polar.data.datasets[0].label = countryCode;
        let freeTime = (24 * 7 - country.Work - country.Study - 56) / 5; // Approx
        charts.polar.data.datasets[0].data = [
            country.Happiness * 10,
            country.MentalHealth,
            country.PerformIndex * 100,
            freeTime
        ];
        charts.polar.update();
    }
}

// ---------------- 3. Metrics & Overlay ----------------

function renderMetrics(countryCode = null) {
    const container = document.getElementById('metrics-container');

    if (countryCode) {
        const c = studentData.find(d => d.Country === countryCode);
        const metrics = [
            { label: 'Happiness', value: c.Happiness.toFixed(2) + '/5', sub: c.Country },
            { label: 'Housing Cost', value: c.HousingCosts + ' €', sub: 'Monthly' },
            { label: 'Performance', value: c.PerformIndex.toFixed(2), sub: 'Index Score' },
            { label: 'Mental Health', value: c.MentalHealth, sub: 'Self-Reported' }
        ];
        container.innerHTML = createMetricCards(metrics);
    } else {
        // Global Extremes (Default)
        const happiest = studentData.filter(d => d.Happiness > 0).reduce((p, c) => c.Happiness > p.Happiness ? c : p);
        const mostExpensive = studentData.reduce((p, c) => c.HousingCosts > p.HousingCosts ? c : p);
        const bestEff = studentData.reduce((p, c) => c.PerformIndex > p.PerformIndex ? c : p);

        const metrics = [
            { label: 'Happiest', value: happiest.Country, sub: `${happiest.Happiness.toFixed(2)}/5` },
            { label: 'Most Expensive', value: mostExpensive.Country, sub: `${mostExpensive.HousingCosts} €` },
            { label: 'Top Performance', value: bestEff.Country, sub: `Idx: ${bestEff.PerformIndex}` },
            { label: 'Total Countries', value: studentData.length, sub: 'In Dataset' }
        ];
        container.innerHTML = createMetricCards(metrics);
    }
}

function createMetricCards(metrics) {
    return metrics.map(m => `
        <div class="metric-card">
            <div class="metric-label">${m.label}</div>
            <div class="metric-value">${m.value}</div>
            <div style="color: #64748b; font-size: 0.85rem;">${m.sub}</div>
        </div>
    `).join('');
}

function showOverlay(countryCode) {
    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('overlay-content');
    const c = studentData.find(d => d.Country === countryCode);

    // Calculate Ranks
    const happyRank = [...studentData].sort((a, b) => b.Happiness - a.Happiness).findIndex(d => d.Country === countryCode) + 1;
    const costRank = [...studentData].sort((a, b) => b.HousingCosts - a.HousingCosts).findIndex(d => d.Country === countryCode) + 1;

    overlay.classList.remove('hidden');
    content.innerHTML = `
        <div class="overlay-header">
            <div id="map-container"></div>
            <h2 class="overlay-title">${c.Country}</h2>
            <div style="margin-top:10px;">
                <span class="rank-badge">Happiness Rank: #${happyRank}</span>
                <span class="rank-badge">Cost Rank: #${costRank}</span>
            </div>
        </div>
        
        <div class="overlay-stat-row">
            <span>Work Hours</span>
            <span class="stat-val">${c.Work} h/week</span>
        </div>
        <div class="overlay-stat-row">
            <span>Study Hours</span>
            <span class="stat-val">${c.Study} h/week</span>
        </div>
        <div class="overlay-stat-row">
            <span>Housing</span>
            <span class="stat-val" style="color:#f59e0b">${c.HousingCosts} €</span>
        </div>
        
        <hr style="border-color:rgba(255,255,255,0.1); margin: 20px 0;">
        
        <p style="color:#94a3b8; line-height: 1.6;">
            A deeper look at <strong>${c.Country}</strong> shows a performance index of 
            <span style="color:#fff">${c.PerformIndex}</span>. 
            Students here balance ${c.Work} hours of work with ${c.Study} hours of study.
        </p>
    `;

    // Initialize Map
    setTimeout(() => {
        if (window.overlayMap) {
            window.overlayMap.remove();
        }
        const coords = countryCoordinates[countryCode] || [48, 14]; // Default Fallback
        window.overlayMap = L.map('map-container', {
            center: coords,
            zoom: 4,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false
        });

        // Add Dark Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(window.overlayMap);

        // Add GeoJSON Layer for Highlighting
        if (worldGeoJSON) {
            L.geoJSON(worldGeoJSON, {
                style: function (feature) {
                    // Mapping for common name discrepancies
                    const name = feature.properties.name;
                    const isSelected = name === countryCode ||
                        (countryCode === 'Czech Republic' && name === 'Czechia') ||
                        (countryCode === 'United States' && name === 'USA');

                    return {
                        color: isSelected ? '#fbbf24' : '#334155',
                        weight: isSelected ? 2 : 0.5,
                        opacity: 1,
                        fillOpacity: isSelected ? 0.3 : 0,
                        fillColor: isSelected ? '#fbbf24' : 'transparent'
                    };
                }
            }).addTo(window.overlayMap);
        } else {
            // Fallback to Marker if GeoJSON not loaded
            L.circleMarker(coords, {
                radius: 8,
                fillColor: "#fbbf24",
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(window.overlayMap);
        }
    }, 100);
}

window.closeOverlay = function () {
    document.getElementById('detail-overlay').classList.add('hidden');
    // Optional: Reset selection? Or keep it? Let's keep selection but hide overlay.
};

// ---------------- 4. Chart Validations (Render Logic) ----------------

function renderAllCharts() {
    renderRadar();
    renderScatter();
    renderBar();
    renderDoughnut();
    renderEfficiency();
    renderPolar();
    renderStacked();
    renderCostPie();
    renderLine();
    renderBubble();
    renderRatio();
}

// --- Chart Functions (Updating onclicks) ---

// 1. Radar
function renderRadar() {
    const ctx = document.getElementById('radarCanvas').getContext('2d');
    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Work', 'Study', 'Happiness', 'Cost', 'Mental Health', 'Performance'],
            datasets: [{
                label: 'Global Average',
                data: [globalAvg.Work, globalAvg.Study, globalAvg.Happiness * 10, 50, globalAvg.MentalHealth, 30],
                fill: true,
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                borderColor: '#94a3b8'
            }]
        },
        options: {
            responsive: true,
            scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#e2e8f0' }, ticks: { display: false } } }
        }
    });
}

// 2. Scatter
function renderScatter() {
    const ctx = document.getElementById('scatterCanvas').getContext('2d');
    charts.scatter = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Countries',
                data: studentData.map(d => ({ x: d.Study, y: d.Work, country: d.Country })),
                backgroundColor: COLORS.secondary,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            onClick: (e, els) => {
                if (els.length > 0) {
                    const idx = els[0].index;
                    selectCountry(charts.scatter.data.datasets[0].data[idx].country);
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            return context[0].raw.country;
                        },
                        label: function (context) {
                            return `Study: ${context.parsed.x}h, Work: ${context.parsed.y}h`;
                        }
                    }
                }
            },
            scales: { x: { title: { display: true, text: 'Study Hours (Per Week)' } }, y: { title: { display: true, text: 'Work Hours (Per Week)' } } }
        }
    });
}

// 3. Bar
function renderBar() {
    const ctx = document.getElementById('barCanvas').getContext('2d');
    const sorted = [...studentData].sort((a, b) => b.MentalHealth - a.MentalHealth);
    charts.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.Country),
            datasets: [{
                label: 'Score',
                data: sorted.map(d => d.MentalHealth),
                backgroundColor: COLORS.default,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            onClick: (e, els) => {
                if (els.length > 0) {
                    const idx = els[0].index;
                    selectCountry(charts.bar.data.labels[idx]);
                }
            },
            plugins: { legend: { display: false } },
            aspectRatio: 1.5,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    display: true,
                    title: { display: true, text: 'Mental Health Score', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// 4. Doughnut
function renderDoughnut() {
    const ctx = document.getElementById('doughnutCanvas').getContext('2d');

    // Categorize countries by happiness
    let highCountries = studentData.filter(d => d.Happiness >= 3.65);
    let medCountries = studentData.filter(d => d.Happiness >= 3.5 && d.Happiness < 3.65);
    let lowCountries = studentData.filter(d => d.Happiness > 0 && d.Happiness < 3.5);

    charts.doughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [highCountries.length, medCountries.length, lowCountries.length],
                backgroundColor: [COLORS.secondary, COLORS.highlight, COLORS.accent],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            const label = context[0].label;
                            const count = context[0].parsed;
                            if (label === 'High') return `High (≥3.65): ${count} countries`;
                            if (label === 'Medium') return `Medium (3.5-3.65): ${count} countries`;
                            if (label === 'Low') return `Low (<3.5): ${count} countries`;
                        },
                        label: function (context) {
                            const label = context.label;
                            let countries;
                            if (label === 'High') countries = highCountries;
                            else if (label === 'Medium') countries = medCountries;
                            else countries = lowCountries;

                            return countries.map(d => `${d.Country}: ${d.Happiness.toFixed(2)}`);
                        }
                    }
                }
            }
        }
    });
}

// 5. Efficiency
function renderEfficiency() {
    const ctx = document.getElementById('efficiencyBarCanvas').getContext('2d');
    const sorted = [...studentData].sort((a, b) => b.PerformIndex - a.PerformIndex).slice(0, 10);
    charts.efficiency = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.Country),
            datasets: [{
                data: sorted.map(d => d.PerformIndex),
                backgroundColor: '#8b5cf6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1.5,
            onClick: (e, els) => {
                if (els.length > 0) {
                    const idx = els[0].index;
                    selectCountry(charts.efficiency.data.labels[idx]);
                }
            },
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    title: { display: true, text: 'Countries', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    title: { display: true, text: 'Performance Index', color: '#94a3b8' },
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// 6. Polar
function renderPolar() {
    const ctx = document.getElementById('polarAreaCanvas').getContext('2d');
    charts.polar = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Happy', 'Mental', 'Perf', 'Free'],
            datasets: [{
                // Initial data using Global Averages
                data: [
                    globalAvg.Happiness * 10,
                    globalAvg.MentalHealth,
                    (globalAvg.PerformIndex || 0.5) * 100, // Fallback if undefined
                    (24 * 7 - globalAvg.Work - globalAvg.Study - 56) / 5
                ],
                backgroundColor: [COLORS.secondary, '#10b981', '#8b5cf6', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            scales: { r: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' } } },
            plugins: { legend: { display: false } }
        }
    });
}

// 7. Stacked
function renderStacked() {
    const ctx = document.getElementById('stackedBarCanvas').getContext('2d');
    const sorted = [...studentData].sort((a, b) => (b.Work + b.Study) - (a.Work + a.Study));
    charts.stacked = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.Country),
            datasets: [
                { label: 'Study', data: sorted.map(d => d.Study), backgroundColor: '#3b82f6' },
                { label: 'Work', data: sorted.map(d => d.Work), backgroundColor: '#f97316' }
            ]
        },
        options: {
            responsive: true,
            aspectRatio: 1.5,
            scales: {
                x: {
                    stacked: false,
                    title: { display: true, text: 'Countries', color: '#94a3b8' },
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    stacked: false,
                    title: { display: true, text: 'Hours per Week', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: { legend: { display: true, position: 'top', labels: { color: '#e2e8f0' } } }
        }
    });
}

// 8. Cost Pie
function renderCostPie() {
    const ctx = document.getElementById('treemapCanvas').getContext('2d');
    const sorted = [...studentData].sort((a, b) => b.HousingCosts - a.HousingCosts);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);
    const othersSum = others.reduce((acc, c) => acc + c.HousingCosts, 0);
    charts.costPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: top5.map(d => d.Country).concat(['Others']),
            datasets: [{
                data: top5.map(d => d.HousingCosts).concat([othersSum]),
                backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#334155'],
                borderWidth: 0
            }]
        },
        options: { plugins: { legend: { position: 'right' } } }
    });
}

// 9. Line
function renderLine() {
    const ctx = document.getElementById('lineCanvas').getContext('2d');
    const sorted = [...studentData].sort((a, b) => b.Happiness - a.Happiness);
    charts.line = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sorted.map(d => d.Country),
            datasets: [{
                data: sorted.map(d => d.Happiness),
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    display: true,
                    title: { display: true, text: 'Happiness Score', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// 10. Bubble
function renderBubble() {
    const ctx = document.getElementById('heatmapCanvas').getContext('2d');
    charts.bubble = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                data: studentData.map(d => ({ x: d.HousingCosts, y: d.Happiness, r: d.PerformIndex * 30, country: d.Country })),
                backgroundColor: COLORS.highlight,
                borderColor: COLORS.highlight
            }]
        },
        options: {
            responsive: true,
            onClick: (e, els) => {
                if (els.length > 0) {
                    const idx = els[0].index;
                    selectCountry(charts.bubble.data.datasets[0].data[idx].country);
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            return context[0].raw.country;
                        },
                        label: function (context) {
                            const d = context.raw;
                            return `Cost: ${d.x}€, Happy: ${d.y}, Perf: ${(d.r / 30).toFixed(2)}`;
                        }
                    }
                }
            },
            scales: { x: { type: 'logarithmic', title: { display: true, text: 'Cost' } }, y: { title: { display: true, text: 'Happiness' } } }
        }
    });
}

// 12. Ratio
function renderRatio() {
    const ctx = document.getElementById('ratioCanvas').getContext('2d');
    const sorted = [...studentData].sort((a, b) => (b.Study / b.Work) - (a.Study / a.Work));
    charts.ratio = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.Country),
            datasets: [{
                data: sorted.map(d => (d.Study / d.Work).toFixed(2)),
                backgroundColor: '#ec4899',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1.5,
            onClick: (e, els) => {
                if (els.length > 0) {
                    const idx = els[0].index;
                    selectCountry(charts.ratio.data.labels[idx]);
                }
            },
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    title: { display: true, text: 'Countries', color: '#94a3b8' },
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    title: { display: true, text: 'Study/Work Ratio', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}
