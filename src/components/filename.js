import React    from 'react';

import procedureDir from '../lib/procedure-dir.js'

import electron from 'electron'
const remote    = electron.remote;
const  dialog   = remote.dialog;

import path     from 'path';

function Filename(props) {
  const buttonClasses   = ['btn', 'btn-default'];
  const filenameClasses = ['form-control'];
  if (props.disabled) {
    buttonClasses.push('disabled');
    filenameClasses.push('disabled');
  }
  const handleClick = (event) => {
    let defaultPath = procedureDir.path;
    if (props.filename) {
      defaultPath = path.dirname(props.filename);
    }
    const result = dialog.showOpenDialog(remote.getCurrentWindow(), {
      defaultPath,
      properties: [
        'openFile'
      ],
      filters: [
        { name: 'YAML', extensions: ['yaml'] }
      ]
    });
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
          className={filenameClasses.join(' ')}
        >{path.basename(props.filename)}</div>
        <button
          className={buttonClasses.join(' ')}
          type="button"
          style={{flex: 'none'}}
          onClick={handleClick}
          disabled={!!props.disabled}
        >...</button>
      </div>
    </div>
  );
}

export default Filename;
