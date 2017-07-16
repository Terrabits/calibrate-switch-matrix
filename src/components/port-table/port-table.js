import React from 'react';
import Head  from './head.js';
import Row   from './row.js';

function PortTable(props) {
  const rows = [];
  if (props.ports) {
    for (let vnaPort of Object.keys(props.ports)) {
      rows.push(<Row key={vnaPort} vnaPort={vnaPort} matrixPort={props.ports[vnaPort]} />);
    }
  }
  return (
    <table className="table-striped port-table">
      <Head />
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default PortTable;
