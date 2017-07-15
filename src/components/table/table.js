import React from 'react';
import Head  from './head.js';
import Row   from './row.js';

function Table(props) {
  return (
    <table className="table-striped">
      <Head />
      <tbody>
        <Row />
      </tbody>
    </table>
  );
}

export default Table;
