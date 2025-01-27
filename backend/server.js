const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());
// Create a MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'aravind',
//   password: 'aravind@1604',
//   database: 'database2',
// });

// // Connect to the MySQL server
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

const oracledb = require('oracledb');

const dbConfig = {
  user: 'sys',
  password: 'aravind@1604',
  connectString: 'localhost:1522/orcl',
  privilege: oracledb.SYSDBA,
};

// oracledb.getConnection(dbConfig, (err, connection) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   console.log('Connected to Oracle Database');
// // });

//   // Use the connection for database operations

// //   // Release the connection when done
//   // connection.close((err) => {
//   //   if (err) {
//   //     console.error(err.message);
//   //   } else {
//   //     console.log('Connection closed');
//   //   }
//   // });
// });


// // Define a route to fetch data from MySQL
// app.post('/query1', (req, res) => {
//   const { to_year, from_year, property_type, town } = req.body;
//   const query = `SELECT
//   t2.ListYear,
//   AVG(t1.SaleAmount) AS Avg_Sale_Amount,
//   AVG(t2.Crime_Rate) AS Avg_Crime_Rate
// FROM
// propertysales t1
// JOIN (
//   SELECT
//       Town,
//       ListYear,
//       COUNT(DR_NO) AS Crime_Rate
//   FROM
//       crimedata
//   GROUP BY
//       Town, ListYear
// ) t2 ON t1.Town = t2.Town AND t1.ListYear = t2.ListYear
// WHERE
//       t1.ListYear BETWEEN ${from_year} AND ${to_year}
//       AND (t1.PropertyType = '${property_type}' )
//       AND (t1.Town = '${town}' OR t2.Town = '${town}')
// GROUP BY
//   t1.ListYear, t1.Town
// ORDER BY
//   t1.ListYear, t1.Town
//   ;`; 
//   connection.execute(query, (error, rows) => {
//     if (error) {
//       console.error('Error executing MySQL query:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }
//     const labels = rows.map(row => row.ListYear);
//     const data2 = rows.map(row => row.Avg_Crime_Rate);
//     const data = rows.map(row => row.Avg_Sale_Amount);
//      res.json({labels,data,data2});
//   });
// });
app.post('/query1', (req, res) => {
  oracledb.getConnection(dbConfig, async (err, connection) => {
    try {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const { to_year, from_year, property_type, town } = req.body;
    const query = `SELECT
     t1.ListYear as ListYear,
    AVG(t1.SaleAmount) AS Avg_Sale_Amount,
    AVG(t2.Crime_Rate) AS Avg_Crime_Rate
  FROM
    propertysales t1
  JOIN (
    SELECT
      Town,
      EXTRACT(YEAR FROM ListYear) AS ListYear,
      COUNT(DR_NO) AS Crime_Rate
    FROM
      crimedata
    GROUP BY
      Town, EXTRACT(YEAR FROM ListYear)
  ) t2 ON t1.Town = t2.Town AND t2.ListYear = t1.ListYear
  GROUP BY
    t1.ListYear, t1.Town
  ORDER BY
  t1.ListYear, t1.Town   
    `;

    const result = await connection.execute(query);

    if (!Array.isArray(result.rows)) {
      throw new Error('Query result is not an array');
    }
  //  console.log(result.rows);
   const labels = result.rows.map(row => row[0]); // Assuming Year is at index 0
   const data = result.rows.map(row => row[1]);   // Assuming Avg_Sale_Amount is at index 1
   const data2 = result.rows.map(row => row[2]); 

    // Send the response
    res.json({ labels, data2, data });
  } catch (error) {
    console.error('Error executing Oracle query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Release the connection when done with the query
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err.message);
      }
    }
  }
});
});
// Define a route to fetch data from MySQL
app.post('/query2', (req, res) => {
  const { to_year, from_year, property_type, town } = req.body;
  const query = `SELECT
  ListYear,
  PropertyType,
  AVG(SalesRatio) AS Avg_Sale_Ratio
FROM
propertysales
WHERE
      ListYear BETWEEN ${from_year} AND ${to_year}
GROUP BY
  ListYear, PropertyType
ORDER BY
  ListYear, PropertyType;
`; 
  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const labels = rows.map(row => row.ListYear);
    const data = rows.map(row => row.PropertyType);
    const data2 = rows.map(row => row.Avg_Sale_Ratio);
     res.json({labels,data,data2});
  });
});

app.post('/query3', (req, res) => {
  const { to_year, from_year, property_type, town } = req.body;
  const query = `SELECT
  p.ListYear,
  p.Town,
  AVG(p.SaleAmount) AS Avg_Sale_Amount,
  AVG(p.SalesRatio) AS Avg_Interest_Rate
FROM
propertysales p
GROUP BY
  p.ListYear, p.Town
ORDER BY
  p.ListYear, p.Town;

`; 
  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const labels = rows.map(row => row.ListYear);
    const data = rows.map(row => row.Town);
    const data2 = rows.map(row => row.Avg_Sale_Amount);
    const data3 = rows.map(row => row.Avg_Interest_Rate);
     res.json({labels,data,data2,data3});
  });
});

app.post('/query4', (req, res) => {
  const { to_year, from_year, property_type, town } = req.body;
  const query = `SELECT
  ListYear,
  CASE
      WHEN MONTH(DateRecorded) IN (12, 1, 2) THEN 'Winter'
      WHEN MONTH(DateRecorded) IN (3, 4, 5) THEN 'Spring'
      WHEN MONTH(DateRecorded) IN (6, 7, 8) THEN 'Summer'
      ELSE 'Fall'
  END AS Season,
  AVG(SaleAmount) AS Avg_Sale_Amount
FROM
propertysales
WHERE
    ListYear BETWEEN ${from_year} AND ${to_year}
GROUP BY
  ListYear, Season
ORDER BY
  ListYear, Season;
`; 
  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const labels = rows.map(row => row.ListYear);
    const data = rows.map(row => row.Season);
    const data2 = rows.map(row => row.Avg_Sale_Amount);
     res.json({labels,data,data2});
  });
});

app.post('/query5', (req, res) => {
  const query = `SELECT
  ListYear,
  AVG(CASE WHEN DateRecorded BETWEEN '2020-01-01' AND '2020-12-31' THEN SaleAmount END) AS Avg_Sale_Amount_Rec,
  AVG(CASE WHEN DateRecorded BETWEEN '2021-01-01' AND '2021-12-31' THEN SaleAmount END) AS Avg_Sale_Amount_Covid
FROM
propertysales
WHERE
  ListYear BETWEEN 2020 AND 2023
GROUP BY
  ListYear
ORDER BY
  ListYear;

`; 
  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const labels = rows.map(row => row.ListYear);
    const data = rows.map(row => row.Avg_Sale_Amount_Rec);
    const data2 = rows.map(row => row.Avg_Sale_Amount_Covid);
     res.json({labels,data,data2});
  });
});

app.post('/query6', (req, res) => {
  const { to_year, from_year, property_type, town } = req.body;
  const query = `WITH PreferredResidentialTypes AS (
    SELECT
        ListYear,
        Town,
        ResidentialType,
        COUNT(*) AS Count
    FROM
        propertysales
    WHERE
        PropertyType = 'Residential'
        
    GROUP BY
        ListYear, ResidentialType
    ORDER BY
        ListYear, Town, Count DESC
)
SELECT
    *
FROM (
    SELECT
        *,
        RANK() OVER (PARTITION BY ListYear, Town ORDER BY Count DESC) AS Ranks
    FROM
        PreferredResidentialTypes
) AS Ranked
WHERE
    Ranks = 1
ORDER BY
    ListYear, Town
;

`; 
  connection.query(query, (error, rows) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const labels = rows.map(row => row.ListYear);
    const data3 = rows.map(row => row.Town);
    const data = rows.map(row => row.ResidentialType);
    const data2 = rows.map(row => row.Count);
     res.json({labels,data,data2});
  });
});
// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
