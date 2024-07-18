import TableForm from './TableForm';
import TableList from './TableList';
import SQLQueryForm from './SQLQueryForm';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Table() {
    return (
        <div className="App">
          <header className="App-header">
            <h1>Table Manager</h1>
          </header>
          
          <TableForm />
          <TableList />
          <SQLQueryForm/>
        </div>
      );
}

export default Table;