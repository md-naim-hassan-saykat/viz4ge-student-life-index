# The Student Life Index  
### Financial Stress and Academic Performance Across Europe

An interactive academic dashboard analyzing the relationship between accommodation-cost stress and student academic performance across European countries.

**Live Demo:**  
https://md-naim-hassan-saykat.github.io/viz4ge-student-life-index/

---

## Project Overview

This project explores how housing cost stress influences students’ academic performance, work-study balance, and wellbeing across Europe.

Using data from the **Eurostudent VII Survey**, we designed an interactive dashboard that combines:

- Research-driven analysis  
- Data normalization and composite metrics  
- Interactive physics-based visualization  
- Multi-view analytical charts  
- Visual storytelling principles  

The dashboard enables users to compare countries and explore relationships between financial stress and student outcomes.

---

## Research Question

> How does accommodation-cost financial stress affect academic performance and student engagement across European countries?

---

## Methodology

**Data Source:** Eurostudent VII Survey  
**Countries Included:** European countries  
**Normalization:** All variables scaled to 0–100  
**Performance Index:** Composite metric derived from academic-related indicators  

### Key Variables

- Housing Cost (proxy for financial stress)
- Work Hours
- Study Hours
- Performance Index (composite)
- Happiness / Mental Health

---

## Key Findings (Prototype Insight)

- Higher accommodation-cost stress tends to correlate with lower academic performance.
- Increased work hours are associated with reduced study time.
- Moderate financial stress appears linked to more balanced work–study patterns.
- Student wellbeing varies across financial contexts.

*Note: Findings represent exploratory data insights rather than causal conclusions.*

---

## Features

- Interactive bubble visualization (p5.js + Matter.js physics engine)
- Multi-view analytical charts (Chart.js)
- Dynamic country selection
- Summary metric cards
- Research narrative integration
- Clean, responsive UI design

---

## Tech Stack

- HTML
- CSS
- JavaScript
- p5.js
- Matter.js
- Chart.js
- GitHub Pages (Deployment)

---

## Project Structure

index.html        # Main dashboard layout
style.css         # Styling and UI design
sketch.js         # Interactive physics-based bubble visualization
charts.js         # Analytical chart logic
data.js           # Processed dataset
data - Sheet1.csv # Source dataset
background.js     # Animated background
p5.min.js         # p5.js library

---

## Running Locally

Clone the repository:
```bash
git clone https://github.com/md-naim-hassan-saykat/viz4ge-student-life-index.git
cd viz4ge-student-life-index
```

Start a local server:
```bash
python3 -m http.server 8000
```

Then open:
```bash
http://localhost:8000
```

---

## Academic Context

Developed as part of an **Information Visualization course project (2026)**.  

This was a collaborative group project focused on integrating:

- Data analysis
- Interaction design
- Visual encoding principles
- Dashboard architecture
- Research-based interpretation

The objective was to design an interactive, research-driven dashboard that integrates analytical rigor with effective visual storytelling.

---

## License

This project is licensed under the MIT License.
