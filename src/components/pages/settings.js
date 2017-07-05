import React    from 'react';
import LineEdit from '../line-edit.js';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let values    = this.props.values;
    let onChanges = this.props.onChanges;
    return(
      <div id="settings-page">
        <h4>VNA Address</h4>
        <LineEdit value={values.vnaAddress}        onChange={onChanges.handleVnaAddressChange} />
        <h4>Switch Matrix Address</h4>
        <LineEdit value={values.matrixAddress}     onChange={onChanges.handleMatrixAddressChange} />
        <h4>Procedure</h4>
        <LineEdit value={values.procedureFilename} onChange={onChanges.handleProcedureFilenameChange}/>
      </div>
    );
  }
}

export default SettingsPage;
