import React    from 'react';
import LineEdit from '../line-edit.js';


function SettingsPage(props) {
  console.log('props.invisible: ' + props.invisible);
  let classes = props.invisible ? 'invisible page' : 'page';
  classes = classes + ' container-fluid'
  console.log('SettingsPage classes: ' + classes);
  return(
    <div id="settings-page" className={classes}>
      <h2>Settings</h2>
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
