// export default Query1;
import React, { useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
const Query6 = () => {
  const [formData, setFormData] = useState({
    to_year: '',
    from_year: '',
    property_type: '',
    town: '',
  });

  const [chartData, setChartData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a request to your Express server
    axios.post('http://localhost:5000/query6', formData)
      .then(response => {
        const { labels, data, data2 } = response.data;
        console.log(labels,data,data2);

        // Set up the chart data
        setChartData({
          labels: labels,
          datasets: [{
            label: 'REAL ESTATE vs Crime Rate',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        });

        // Plot the chart
        plotChart(labels, data2, data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const plotChart = (years, crimerate, propertyTypes) => {
    const uniqueYears = [...new Set(years)];

    const dataByYear = uniqueYears.map((year) => {
        // Filter crime rates for the current year
        const crimeRatesForYear = propertyTypes.map((propertyType, index) => {
          if (years[index] === year) {
            return {
              propertyType,
              crimeRate: crimerate[index],
            };
          }
          return null;
        }).filter(Boolean);
  
        // Create an object with crime rates for each property type
        const crimeRatesByType = crimeRatesForYear.reduce((acc, entry) => {
          acc[entry.propertyType] = entry.crimeRate;
          return acc;
        }, {});
  
        return {
          year,
          crimeRatesByType,
        };
      });

      const datasets = propertyTypes.map((propertyType) => ({
        label: propertyType,
        data: dataByYear.map((entry) => entry.crimeRatesByType[propertyType] || null),
        borderColor: getRandomColor(),
        borderWidth: 2,
        fill: false,
      }));
  
      const data = {
        labels: uniqueYears,
        datasets: datasets,
      };
  
      setChartData(data);
 
    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
       datasets:  datasets,
    }});
   };

  return (
    <div>
      <h1>PREFERRED RESIDENTIAL PROPERTY TYPE</h1>
      <form onSubmit={handleSubmit}>
        <label>
          To Year:
          <input type="number" name="to_year" value={formData.to_year} onChange={handleInputChange} />
        </label>
        <label>
          From Year:
          <input type="number" name="from_year" value={formData.from_year} onChange={handleInputChange} />
        </label>
        <label>
          Property Type:
          <input type="text" name="property_type" value={formData.property_type} onChange={handleInputChange} />
        </label>
        <label>
          Town:
          <input type="text" name="town" value={formData.town} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {chartData.datasets && <Line data={chartData} />}
    </div>
  );
};

export default Query6;

















// // Query1.js
// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import axios from 'axios';
// import Chart from 'chart.js/auto';
// const Query1 = () => {
//   const [chartData, setChartData] = useState({});

//   useEffect(() => {
//     // Make a request to your Express server
//     const to_year = 2023;
//     const from_year = 2020;
//     const property_type = 'Residential'; // Example property type
//     const town = 'Ansonia'; // Example town

//     // Make a request to your Express server with user input in the request body
//     axios.post('http://localhost:5000/query1', { to_year, from_year, property_type, town })
//       .then(response => {
//         const { labels, data,data2 } = response.data;
//         console.log(labels);
//         // Set up the chart data
//         setChartData({
//           labels: labels,
//           datasets: [{
//             label: 'REAL ESTATE vs Crime Rate',
//             data: data,
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1,
//           }],
//         });

//         // Plot the chart
//         plotChart(labels, data2,data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   const plotChart = (years, crimerate ,SaleAmount) => {
//     var ctx = document.getElementById('myChart').getContext('2d');
//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: years,
//         datasets: [{
//           label: 'Sales',
//           data: SaleAmount,
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 2,
//           fill: false
//         }, {
//           label: 'Crime Rate',
//           data: crimerate,
//           borderColor: 'rgba(255, 206, 86, 1)',
//           borderWidth: 2,
//           fill: false
//         }],
//       },
//     });
//   };

//   // const plotChart = (labels, data) => {
//   //   var ctx = document.getElementById('myChart').getContext('2d');
//   //   new Chart(ctx, {
//   //     type: 'line',
//   //     data: {
//   //       labels: labels,
//   //       datasets: [{
//   //         label: 'REAL ESTATE vs Crime Rate',
//   //         data: data,
//   //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//   //         borderColor: 'rgba(75, 192, 192, 1)',
//   //         borderWidth: 1,
//   //       }],
//   //     },
//   //   });
//   // };

//   return (
//     <div>
//     <h1>REAL ESTATE SALES VS CRIME RATE</h1>
//       <canvas id="myChart" width="400" height="400">hello</canvas>
//     </div>
//   );
// };