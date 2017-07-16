import React     from 'react';
import LineEdit  from '../line-edit.js';
import Filename from '../filename.js';


function SettingsPage(props) {
  let classes = props.invisible ? 'invisible page' : 'page';
  return(
    <div id="settings-page" className={classes}>
      <h2 className="no-margin-top">Settings</h2>
      <form>
        <LineEdit
          label="VNA Address"
          value={props.values.vnaAddress}
          onChange={props.onChanges.handleVnaAddressChange}
          disabled={!!props.disabled}
        />
        <LineEdit
          label="Switch matrix Address"
          value={props.values.matrixAddress}
          onChange={props.onChanges.handleMatrixAddressChange}
          disabled={!!props.disabled}
        />
        <Filename
          label="Procedure"
          filename={props.values.procedureFilename}
          // extensions={['.yaml']}
          onChange={props.onChanges.handleProcedureFilenameChange}
          disabled={!!props.disabled}
        />
      </form>
    </div>
  );
}

export default SettingsPage;
