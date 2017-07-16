import React from 'react';

function Row(props) {
  return (
    <tr>
      <td>{props.vnaPort}</td>
      <td>{props.matrixPort}</td>
    </tr>
  );
}

export default Row
