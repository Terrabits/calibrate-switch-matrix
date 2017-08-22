import React    from 'react';
import electron from 'electron'
import path     from 'path';

const remote    = electron.remote;
const  dialog   = remote.dialog;

function Filename(props) {
  const buttonClasses   = ['btn', 'btn-default'];
  const filenameClasses = ['form-control'];
  if (props.disabled) {
    buttonClasses.push('disabled');
    filenameClasses.push('disabled');
  }
  const handleClick = (event) => {
    const result = dialog.showOpenDialog(remote.getCurrentWindow(), {
      defaultPath: 'C:\\Users\\Public\\Documents\\Rohde-Schwarz\\Calibrate Switch Matrix\\switch matrices\\',
      properties: [
        'openFile'
    ]});
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
