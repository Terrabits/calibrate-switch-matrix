import React    from 'react';
import LineEdit from '../line-edit.js';



function SettingsPage(props) {
  console.log('props.invisible: ' + props.invisible);
  let classes = props.invisible ? 'invisible' : '';
  console.log('SettingsPage classes: ' + classes);
  return(
    <div id="settings-page" className={classes}>
      <h4>VNA Address</h4>
      <LineEdit value={props.values.vnaAddress} onChange={props.onChanges.handleVnaAddressChange} />
      <h4>Switch Matrix Address</h4>
      <LineEdit value={props.values.matrixAddress}     onChange={props.onChanges.handleMatrixAddressChange} />
      <h4>Procedure</h4>
      <LineEdit value={props.values.procedureFilename} onChange={props.onChanges.handleProcedureFilenameChange}/>
    </div>
  );
}

export default SettingsPage;
