import React    from 'react';
import electron from 'electron'
import path     from 'path';

const  dialog   = electron.remote.dialog;

function Filename(props) {
  const onClick = (event) => {
    const result = dialog.showOpenDialog({properties: ['openFile']});
    if (result) {
      props.onChange(result[0]);
    }
  }
  return (
    <div className="form-group">
      <label>{props.label}</label>
      <div style={{
        display: 'flex',
        marginTop: '-8px'
      }}>
        <div
          style={{
            flex: 'auto',
            marginRight: '5px'
          }}
          className="form-control"
        >{path.basename(props.filename)}</div>
        <button
          className="btn btn-default"
          type="button"
          disabled={!!props.disabled}
          onClick={onClick}
          style={{flex: 'none'}}
        >...</button>
      </div>
    </div>
  );
}

export default Filename;
