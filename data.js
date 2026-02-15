// Embedded Data to bypass CORS issues
// Source: data - Sheet1.csv (Updated)
const studentData = [
    { Country: "Austria", Happiness: 3.79505243, HousingCosts: 467.5, Work: 14.6, Study: 30.9, MentalHealth: 52.5, PerformIndex: 0.227 },
    { Country: "Azerbaijan", Happiness: 3.81277445, HousingCosts: 39.7, Work: 9.4, Study: 33.5, MentalHealth: 54.7, PerformIndex: 0.618 },
    { Country: "Switzerland", Happiness: 0, HousingCosts: 469.9, Work: 9.2, Study: 35.6, MentalHealth: 0, PerformIndex: 0 },
    { Country: "Czech Republic", Happiness: 3.58630248, HousingCosts: 282.2, Work: 15.4, Study: 32.8, MentalHealth: 49, PerformIndex: 0.258 },
    { Country: "Germany", Happiness: 0, HousingCosts: 456.2, Work: 10.4, Study: 35.1, MentalHealth: 0, PerformIndex: 0.152 },
    { Country: "Denmark", Happiness: 3.81079645, HousingCosts: 614.4, Work: 8.8, Study: 36.8, MentalHealth: 51.7, PerformIndex: 0.173 },
    { Country: "Estonia", Happiness: 3.7301933, HousingCosts: 289.4, Work: 19.2, Study: 32.1, MentalHealth: 51.1, PerformIndex: 0.249 },
    { Country: "Spain", Happiness: 0, HousingCosts: 363.6, Work: 11.1, Study: 36.6, MentalHealth: 0, PerformIndex: 0.237 },
    { Country: "Finland", Happiness: 3.59783575, HousingCosts: 545.6, Work: 14.3, Study: 26.8, MentalHealth: 52.4, PerformIndex: 0.203 },
    { Country: "France", Happiness: 0, HousingCosts: 494.4, Work: 8.8, Study: 31.1, MentalHealth: 50.5, PerformIndex: 0.2 },
    { Country: "Georgia", Happiness: 3.34983923, HousingCosts: 222.2, Work: 12.4, Study: 33.7, MentalHealth: 54.8, PerformIndex: 0.346 },
    { Country: "Croatia", Happiness: 3.71698113, HousingCosts: 236.8, Work: 14.3, Study: 35.2, MentalHealth: 54, PerformIndex: 0.254 },
    { Country: "Hungary", Happiness: 3.42463347, HousingCosts: 185.2, Work: 15.8, Study: 32.2, MentalHealth: 51.3, PerformIndex: 0.326 },
    { Country: "Ireland", Happiness: 3.57261619, HousingCosts: 760.2, Work: 15.4, Study: 32.1, MentalHealth: 46.2, PerformIndex: 0.149 },
    { Country: "Iceland", Happiness: 3.7649631, HousingCosts: 887.5, Work: 18.4, Study: 34.5, MentalHealth: 56.2, PerformIndex: 0.275 },
    { Country: "Lithuania", Happiness: 3.54201918, HousingCosts: 225.2, Work: 17, Study: 33.5, MentalHealth: 48.8, PerformIndex: 0.346 },
    { Country: "Latvia", Happiness: 3.55426211, HousingCosts: 325, Work: 20.6, Study: 32.9, MentalHealth: 49.1, PerformIndex: 0.336 },
    { Country: "Malta", Happiness: 3.65568862, HousingCosts: 364.6, Work: 19.5, Study: 33.8, MentalHealth: 47.6, PerformIndex: 0.361 },
    { Country: "Netherlands", Happiness: 3.4851877, HousingCosts: 506.5, Work: 11.9, Study: 32.9, MentalHealth: 50.1, PerformIndex: 0.207 },
    { Country: "Norway", Happiness: 3.79979778, HousingCosts: 720.4, Work: 15, Study: 29.4, MentalHealth: 52.4, PerformIndex: 0.153 },
    { Country: "Poland", Happiness: 3.34501229, HousingCosts: 227.9, Work: 18.8, Study: 34.4, MentalHealth: 44.9, PerformIndex: 0.395 },
    { Country: "Portugal", Happiness: 3.38585361, HousingCosts: 299.2, Work: 8.3, Study: 41.3, MentalHealth: 46.5, PerformIndex: 0.168 },
    { Country: "Romania", Happiness: 3.6244234, HousingCosts: 209.9, Work: 15.2, Study: 37.8, MentalHealth: 47.6, PerformIndex: 0.503 },
    { Country: "Sweden", Happiness: 3.38881865, HousingCosts: 553, Work: 8, Study: 32.5, MentalHealth: 54.1, PerformIndex: 0.257 },
    { Country: "Slovakia", Happiness: 3.60252005, HousingCosts: 223.5, Work: 16.1, Study: 33.8, MentalHealth: 46.5, PerformIndex: 0.314 }
];

// Calculate Global Averages for Comparison
const globalAvg = {
    Work: studentData.reduce((acc, curr) => acc + curr.Work, 0) / studentData.length,
    Study: studentData.reduce((acc, curr) => acc + curr.Study, 0) / studentData.length,
    Happiness: studentData.reduce((acc, curr) => acc + curr.Happiness, 0) / studentData.length,
    MentalHealth: studentData.reduce((acc, curr) => acc + curr.MentalHealth, 0) / studentData.length
};

// Layout coordinates for map visualization
const countryCoordinates = {
    "Austria": [47.5162, 14.5501],
    "Azerbaijan": [40.1431, 47.5769],
    "Switzerland": [46.8182, 8.2275],
    "Czech Republic": [49.8175, 15.4730],
    "Germany": [51.1657, 10.4515],
    "Denmark": [56.2639, 9.5018],
    "Estonia": [58.5953, 25.0136],
    "Spain": [40.4637, -3.7492],
    "Finland": [61.9241, 25.7482],
    "France": [46.2276, 2.2137],
    "Georgia": [42.3154, 43.3569],
    "Croatia": [45.1, 15.2],
    "Hungary": [47.1625, 19.5033],
    "Ireland": [53.1424, -7.6921],
    "Iceland": [64.9631, -19.0208],
    "Lithuania": [55.1694, 23.8813],
    "Latvia": [56.8796, 24.6032],
    "Malta": [35.9375, 14.3754],
    "Netherlands": [52.1326, 5.2913],
    "Norway": [60.4720, 8.4689],
    "Poland": [51.9194, 19.1451],
    "Portugal": [39.3999, -8.2245],
    "Romania": [45.9432, 24.9668],
    "Sweden": [60.1282, 18.6435],
    "Slovakia": [48.6690, 19.6990]
};

console.log("Data Loaded via Embedded JS", studentData);
