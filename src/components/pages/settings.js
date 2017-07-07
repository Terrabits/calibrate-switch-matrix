import React    from 'react';
import LineEdit from '../line-edit.js';


function SettingsPage(props) {
  console.log('props.invisible: ' + props.invisible);
  let classes = props.invisible ? 'invisible' : '';
  console.log('SettingsPage classes: ' + classes);
  return(
    <div id="settings-page" className={classes}>
      <form>
        <LineEdit
          label="VNA Address"
          value={props.values.vnaAddress}
          onChange={props.onChanges.handleVnaAddressChange} />
        <LineEdit
          label="Switch matrix Address"
          value={props.values.matrixAddress}
          onChange={props.onChanges.handleMatrixAddressChange} />
        <LineEdit
          label="Procedure"
          value={props.values.procedureFilename}
          onChange={props.onChanges.handleProcedureFilenameChange} />
      </form>
    </div>
  );
}

export default SettingsPage;
