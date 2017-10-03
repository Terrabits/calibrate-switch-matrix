import React from 'react';
import Head  from './head.js';
import Row   from './row.js';

function PortList(props) {
  let rows = [];
  if (props.ports) {
    for (let i of props.ports) {
      rows.push(<Row key={i[0]} vnaPort={i[0]} calUnitPort={i[1]} />);
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

export default PortList;
