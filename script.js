
let trips = [];
let fuelLogs = [];

function logTrip() {
    const driver = document.getElementById('driver').value;
    const date = document.getElementById('date').value;
    const startOdometer = parseFloat(document.getElementById('start-odometer').value);
    const endOdometer = parseFloat(document.getElementById('end-odometer').value);
    const notes = document.getElementById('notes').value;

    if (driver && date && !isNaN(startOdometer) && !isNaN(endOdometer)) {
        const kilometers = endOdometer - startOdometer;
        const fuelUsed = (kilometers / 100) * 9;
        const fuelCost = fuelUsed * 1.793;

        trips.push({ driver, date, startOdometer, endOdometer, kilometers, fuelUsed, fuelCost, notes });
        alert('Trip logged successfully!');
    } else {
        alert('Please fill in all fields.');
    }
}

function logFuel() {
    const driver = document.getElementById('driver').value;
    const date = document.getElementById('date').value;
    const fuelCost = parseFloat(prompt('Enter fuel cost:'));

    if (driver && date && !isNaN(fuelCost)) {
        fuelLogs.push({ driver, date, fuelCost });
        alert('Fuel log added successfully!');
    } else {
        alert('Please fill in all fields.');
    }
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Driver,Date,Start Odometer,End Odometer,Kilometers,Fuel Used,Fuel Cost,Notes\n";
    trips.forEach(trip => {
        csvContent += `${trip.driver},${trip.date},${trip.startOdometer},${trip.endOdometer},${trip.kilometers},${trip.fuelUsed},${trip.fuelCost},${trip.notes}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "driving_logbook.csv");
    document.body.appendChild(link);
    link.click();
}

function showPieCharts() {
    const container = document.getElementById('charts-container');
    container.innerHTML = '';

    const drivers = [...new Set(trips.map(trip => trip.driver))];
    const totalKilometers = drivers.map(driver => {
        return trips.filter(trip => trip.driver === driver).reduce((sum, trip) => sum + trip.kilometers, 0);
    });
    const totalFuelCost = drivers.map(driver => {
        return trips.filter(trip => trip.driver === driver).reduce((sum, trip) => sum + trip.fuelCost, 0);
    });

    const kilometersChart = document.createElement('div');
    kilometersChart.innerHTML = '<h2>Kilometers Driven</h2>';
    container.appendChild(kilometersChart);

    const fuelCostChart = document.createElement('div');
    fuelCostChart.innerHTML = '<h2>Fuel Cost</h2>';
    container.appendChild(fuelCostChart);

    // Pie chart for kilometers driven
    const kilometersData = {
        labels: drivers,
        datasets: [{
            data: totalKilometers,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    };
    const kilometersCtx = document.createElement('canvas');
    kilometersChart.appendChild(kilometersCtx);
    new Chart(kilometersCtx, {
        type: 'pie',
        data: kilometersData
    });

    // Pie chart for fuel cost
    const fuelCostData = {
        labels: drivers,
        datasets: [{
            data: totalFuelCost,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    };
    const fuelCostCtx = document.createElement('canvas');
    fuelCostChart.appendChild(fuelCostCtx);
    new Chart(fuelCostCtx, {
        type: 'pie',
        data: fuelCostData
    });
}

function showLineChart() {
    const container = document.getElementById('charts-container');
    container.innerHTML = '';

    const drivers = [...new Set(trips.map(trip => trip.driver))];
    const labels = trips.map(trip => trip.date);

    const datasets = drivers.map(driver => {
        return {
            label: driver,
            data: trips.filter(trip => trip.driver === driver).map(trip => trip.kilometers),
            borderColor: '#' + Math.floor(Math.random()*16777215).toString(16),
            fill: false
        };
    });

    const lineChartData = {
        labels: labels,
        datasets: datasets
    };

    const lineChartCtx = document.createElement('canvas');
    container.appendChild(lineChartCtx);
    new Chart(lineChartCtx, {
        type: 'line',
        data: lineChartData
    });
}
