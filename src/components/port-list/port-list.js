import React from 'react';
import Head  from './head.js';
import Row   from './row.js';

function PortTable(props) {
  let rows = [];
  if (props.ports) {
    for (let port of props.ports) {
      rows.push(<Row key={port} port={port} />);
    }
  }
  return (
    <table className="table-striped port-list">
      <Head />
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default PortTable;
