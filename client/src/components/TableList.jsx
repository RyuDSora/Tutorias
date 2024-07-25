import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {URIgetTables,URIdropTables,URIUpdateTables,URIcheckTables} from './Urls'

function TableList() {
  const [tables, setTables] = useState({});
  const [updateTableName, setUpdateTableName] = useState('');
  const [addColumns, setAddColumns] = useState([{ name: '', type: '', length: '' }]);
  const [dropColumns, setDropColumns] = useState(['']);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(URIgetTables);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleDeleteTable = async (tableName) => {
    try {
      await axios.delete(URIdropTables+tableName);
      fetchTables();
      alert(`Table ${tableName} deleted successfully`);
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Error deleting table');
    }
  };

  const handleAddColumn = () => {
    setAddColumns([...addColumns, { name: '', type: '', length: '' }]);
  };

  const handleDropColumnChange = (index, event) => {
    const values = [...dropColumns];
    values[index] = event.target.value;
    setDropColumns(values);
  };

  const handleAddDropColumn = () => {
    setDropColumns([...dropColumns, '']);
  };

  const handleAddColumnChange = (index, event) => {
    const values = [...addColumns];
    values[index][event.target.name] = event.target.value;
    setAddColumns(values);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(URIUpdateTables+updateTableName, {
        addColumns,
        dropColumns
      });
      alert('Table updated successfully');
      fetchTables();
    } catch (error) {
      console.error('Error updating table:', error);
      alert('Error updating table');
    }
  };

  const dataTypes = ['VARCHAR', 'INT', 'SERIAL', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'TEXT', 'FLOAT', 'DOUBLE'];

  return (
    <div className="container my-4">
      <div className="card mb-4">
        <div className="card-header">
          <h2>Existing Tables</h2>
        </div>
        <div className="card-body">
          {Object.keys(tables).length === 0 ? (
            <p>No tables found.</p>
          ) : (
            <ul className="list-group">
              {Object.keys(tables).map((tableName, index) => (
                <li key={index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-1">{tableName}</h5>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteTable(tableName)}
                    >
                      Delete
                    </button>
                  </div>
                  <table className="table table-striped mt-3">
                    <thead>
                      <tr>
                        <th>Column Name</th>
                        <th>Data Type</th>
                        <th>Nullable</th>
                        <th>Primary Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tables[tableName].columns.map((column, index) => (
                        <tr key={index}>
                          <td>{column.column_name}</td>
                          <td>{column.data_type}</td>
                          <td>{column.is_nullable}</td>
                          <td>{column.is_primary_key ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableList;
