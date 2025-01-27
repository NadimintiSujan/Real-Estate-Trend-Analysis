// export default Query1;
import React, { useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Query5 = () => {
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
    axios.post('http://localhost:5000/query5', formData)
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

  const plotChart = (years, crimerate, SaleAmount) => {
    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Sales',
          data: SaleAmount,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false
        }, {
          label: 'Crime Rate',
          data: crimerate,
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          fill: false
        }],
      },
    });
  };

  return (
    <div>
      <h1>IMPACT OF THE GREAT RECESSION AND COVID 19 ON THE REAL ESTATE MARKET</h1>
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
      <canvas id="myChart" width="400" height="400">hello</canvas>
    </div>
  );
};

export default Query5;