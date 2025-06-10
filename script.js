let trips = [];
let fuelLogs = [];

function logTrip() {
    const driver = document.getElementById('driver').value;
    const date = document.getElementById('date').value;
    const startOdometer = parseFloat(document.getElementById('start-odometer').value);
    const endOdometer = parseFloat(document.getElementById('end-odometer').value);
    const notes = document.getElementById('notes').value;
    
    const kilometers = endOdometer - startOdometer;
    const fuelUsed = kilometers * 0.09; // 9L per 100km
    const fuelCost = fuelUsed * 1.793; // Brisbane average petrol price
    
    trips.push({ driver, date, startOdometer, endOdometer, kilometers, fuelUsed, fuelCost, notes });
    alert('Trip logged successfully!');
}

function logFuel() {
    const driver = document.getElementById('fuel-driver').value;
    const date = document.getElementById('fuel-date').value;
    const amountSpent = parseFloat(document.getElementById('fuel-amount').value);
    
    fuelLogs.push({ driver, date, amountSpent });
    alert('Fuel spend logged successfully!');
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Driver,Date,Start Odometer,End Odometer,Kilometers,Fuel Used,Fuel Cost,Notes\n";
    trips.forEach(trip => {
        csvContent += `${trip.driver},${trip.date},${trip.startOdometer},${trip.endOdometer},${trip.kilometers},${trip.fuelUsed},${trip.fuelCost},${trip.notes}\n`;
    });
    
    csvContent += "\nDriver,Date,Amount Spent\n";
    fuelLogs.forEach(log => {
        csvContent += `${log.driver},${log.date},${log.amountSpent}\n`;
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
    
    const totalKilometers = trips.reduce((sum, trip) => sum + trip.kilometers, 0);
    const totalFuelCost = trips.reduce((sum, trip) => sum + trip.fuelCost, 0);
    
    const driverKilometers = {};
    const driverFuelCost = {};
    
    trips.forEach(trip => {
        if (!driverKilometers[trip.driver]) driverKilometers[trip.driver] = 0;
        if (!driverFuelCost[trip.driver]) driverFuelCost[trip.driver] = 0;
        
        driverKilometers[trip.driver] += trip.kilometers;
        driverFuelCost[trip.driver] += trip.fuelCost;
    });
    
    const kilometersData = Object.keys(driverKilometers).map(driver => ({ driver, value: driverKilometers[driver] }));
    const fuelCostData = Object.keys(driverFuelCost).map(driver => ({ driver, value: driverFuelCost[driver] }));
    
    createPieChart(container, 'Kilometers Driven', kilometersData);
    createPieChart(container, 'Fuel Cost', fuelCostData);
}

function showLineChart() {
    const container = document.getElementById('charts-container');
    container.innerHTML = '';
    
    const data = trips.map(trip => ({ date: trip.date, kilometers: trip.kilometers, fuelCost: trip.fuelCost }));
    
    createLineChart(container, data);
}

function createPieChart(container, title, data) {
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '400px';
    chartContainer.style.height = '400px';
    chartContainer.style.display = 'inline-block';
    
    const chartTitle = document.createElement('h3');
    chartTitle.textContent = title;
    chartContainer.appendChild(chartTitle);
    
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
    
    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: data.map(item => item.driver),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        }
    });
}

function createLineChart(container, data) {
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '800px';
    chartContainer.style.height = '400px';
    
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
    
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [
                {
                    label: 'Kilometers Driven',
                    data: data.map(item => item.kilometers),
                    borderColor: '#FF6384',
                    fill: false
                },
                {
                    label: 'Fuel Cost',
                    data: data.map(item => item.fuelCost),
                    borderColor: '#36A2EB',
                    fill: false
                }
            ]
        }
    });
}
