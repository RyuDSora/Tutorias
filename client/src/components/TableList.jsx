import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:3000/tables/get-tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleDeleteTable = async (tableName) => {
    try {
      await axios.delete(`http://localhost:3000/tables/drop-table/${tableName}`);
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
      await axios.put(`http://localhost:3000/tables/update-table/${updateTableName}`, {
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

      <form onSubmit={handleUpdateSubmit} className="card">
        <div className="card-header">
          <h2>Update Table</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Table Name</label>
            <input
              type="text"
              className="form-control"
              value={updateTableName}
              onChange={e => setUpdateTableName(e.target.value)}
              required
            />
          </div>
          <h3>Add Columns</h3>
          {addColumns.map((column, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                className="form-control mb-2"
                name="name"
                value={column.name}
                onChange={event => handleAddColumnChange(index, event)}
                placeholder="Column Name"
                required
              />
              <select
                className="form-control mb-2"
                name="type"
                value={column.type}
                onChange={event => handleAddColumnChange(index, event)}
                required
              >
                {dataTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {(column.type === 'VARCHAR' || column.type === 'FLOAT' || column.type === 'DOUBLE') && (
                <input
                  type="text"
                  className="form-control mb-2"
                  name="length"
                  value={column.length}
                  onChange={event => handleAddColumnChange(index, event)}
                  placeholder="Length/Precision"
                />
              )}
            </div>
          ))}
          <button type="button" className="btn bg_principal Blanco" onClick={handleAddColumn}>
            Add Column
          </button>

          <h3 className="mt-4">Drop Columns</h3>
          {dropColumns.map((column, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                className="form-control mb-2"
                value={column}
                onChange={event => handleDropColumnChange(index, event)}
                placeholder="Column Name"
                required
              />
            </div>
          ))}
          <button type="button" className="btn bg_principal Blanco" onClick={handleAddDropColumn}>
            Drop Column
          </button>
          <br />
          <button type="submit" className="btn bg_secundario Blanco mt-4">Update Table</button>
        </div>
      </form>
    </div>
  );
}

export default TableList;
