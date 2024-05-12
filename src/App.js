import { TemplateTable } from './components/template_table';
import './App.css';
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [templates, setTemplates] = useState([]);
  
  const columns = React.useMemo(
    () => [
      { Header: '', accessor: 'emoji' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Description', accessor: 'description' },
      { Header: 'Format', accessor: 'format' },
      { Header: 'Uses', accessor: 'uses' },
      // Add more columns as needed
    ],
    []
  );

  useEffect(() => {
    axios.get('./typeshare.json')
    .then(response => {
      setTemplates(response.data[0].result.data.json);
    })
    .catch(error => console.error('Error fetching data: ', error));
  }, []);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (searchInput) {
      return templates.filter(
        template => 
          template.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          template.description.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    return templates;
  }, [templates, searchInput]);

  const handleSearchChange = event => {
    setSearchInput(event.target.value);
  };

  const handleExport = () => {
    exportToCSV(filteredData, 'templates_export.csv');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={{ pathname: "#"}}>
            <img src="/check.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top"></img>
            Tweet Templates
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="d-flex me-2" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchInput} onChange={handleSearchChange}></input>
              <button className="btn btn-outline-success" type="button" onClick={() => setSearchInput('')}>Clear</button>
            </form>
            <button className="btn btn-secondary" onClick={handleExport}>Export CSV</button>
          </div>
        </div>
      </nav>
      <div className='container mt-3 mb-5'>
        <TemplateTable columns={columns} data={filteredData} />
      </div>
      <footer class="footer mt-auto py-3 bg-body-tertiary">
        <div class="container">
          <span class="text-body-secondary">Made by <Link to={{ pathname: "https://github.com/Ronnel-Matthew-Robles" }} target="_blank">@mattdoesntstop</Link></span>
        </div>
      </footer>
    </div>
  );
}

function exportToCSV(data, filename = 'export.csv') {
  if (!data.length) {
    alert('No data to export');
    return;
  }
  
  // Define columns to exclude
  const columnsToExclude = ['id', 'creatorId', 'packId', 'editionId', 'walkthroughVideo', 'pack'];

  // Extract headers and filter out the ones to exclude
  const headers = Object.keys(data[0]).filter(key => !columnsToExclude.includes(key));

  let csvContent = headers.join(',') + '\r\n'; // Add headers

  // Extract data while excluding certain columns and ensuring emojis are correctly displayed
  data.forEach(row => {
    const rowData = headers.map(header => {
      const value = row[header];
      // If the value contains emoji, ensure it is encoded properly
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`; // Escape quotes by doubling them
      }
      return JSON.stringify(value);
    });
    csvContent += rowData.join(',') + '\r\n';
  });

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a link and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default App;
