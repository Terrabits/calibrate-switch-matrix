const Alert                 = require('./alert.js');
const VnaPage               = require('./vna-page.js');
const OspPage               = require('./osp-page.js');
const PageIndex             = require('./page-index.js');
const ProcedurePage         = require('./procedure-page.js');
const ChooseCalibrationPage = require('./choose-calibration-page.js');
const CalibratePage         = require('./calibrate-page.js');
const MeasurePage           = require('./measure-page.js');
const React                 = require('react');
const Store                 = require('electron-store');
const store                 = new Store();

CalibrationChoices = {
  NONE: 'no calibration',
  EXISTING: 'use existing calibration',
  CALIBRATE: 'calibrate'
}

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index:             new PageIndex(),
      vnaAddress:        store.get('vna-address', 'localhost'),
      ospAddress:        store.get('osp-address', '192.168.1.101'),
      procedureFilename: store.get('procedure-filename', ''),
      calibrationChoice: store.get('calibration-choice', CalibrationChoices.CALIBRATE),
      calGroup:          store.get('cal-group', ''),
      saveCalibrationAs: store.get('save-calibration-as', '')
    };
    this.handleVnaAddressChange = this.handleVnaAddressChange.bind(this);
    this.handleOspAddressChange = this.handleOspAddressChange.bind(this);
    this.handleProcedureFilenameChange = this.handleProcedureFilenameChange.bind(this);
    this.handleCalibrationChoiceChange = this.handleCalibrationChoiceChange.bind(this);
    this.handleCalGroupChange          = this.handleCalGroupChange.bind(this);
    this.handleSaveCalibrationAsChange = this.handleSaveCalibrationAsChange.bind(this);
  }

  handleVnaAddressChange(event) {
    this.vnaAddress = event.target.value;
  }
  handleOspAddressChange(event) {
    this.ospAddress = event.target.value;
  }
  handleProcedureFilenameChange(event) {
    // TODO
    this.procedureFilename = event.target.value;
  }
  handleCalibrationChoiceChange(event) {
    // TODO
    this.calibrationChoice = event.target.value;
  }
  handleCalGroupChange(event) {
    // TODO
    this.calGroup = event.target.value;
  }
  handleSaveCalibrationAsChange(event) {
    // TODO
    this.saveCalibrationAs = event.target.value;
  }
  handleClearAlert() {
    let alert = Object.create(this.state.alert);
    alert.message = null;
    this.setState({alert: alert});
  }

  get vnaAddress() {
    return this.state.vnaAddress;
  }
  set vnaAddress(addr) {
    store.set('vna-address', addr);
    this.setState({vnaAddress: addr});
  }
  get ospAddress() {
    return this.state.ospAddress;
  }
  set ospAddress(addr) {
    store.set('osp-address', addr);
    this.setState({ospAddress: addr});
  }
  get procedureFilename() {
    return this.state.procedureFilename;
  }
  set procedureFilename(filename) {
    store.set('procedure-filename', filename);
    this.setState({procedureFilename: filename});
  }
  get calibrationChoice() {
    this.state.calibrationChoice;
  }
  set calibrationChoice(choice) {
    store.set('calibration-choice', choice);
    this.setState({calibrationChoice: choice});
  }
  get calGroup() {
    return this.state.calGroup;
  }
  set calGroup(name) {
    store.set('cal-group', name);
    this.setState({calGroup: name});
  }
  get saveCalibrationAs() {
    return this.state.saveCalibrationAs;
  }
  set saveCalibrationAs(name) {
    store.set('save-calibration-as', name);
    this.setState({saveCalibrationAs: name});
  }

  setPage(index, params) {
    this.setState({
      index: index,
      params: params
    });
  }

  render() {
    return (
      <div id="pages" className="wizard row">
        <VnaPage address={this.state.vnaAddress} onChange={this.handleVnaAddressChange} />
        <OspPage address={this.state.ospAddress} onChange={this.handleOspAddressChange} />
        <ProcedurePage filename={this.state.procedureFilename} onChange={this.handleProcedureFilenameChange} />
        <ChooseCalibrationPage choice={this.state.calibrationChoice} onChoiceChange={this.handleCalibrationChoiceChange} onChange={this.handleCalibrationChoiceChange} />
        <CalibratePage step={this.state.index.step} params={this.state.params} value={this.state.saveCalibrationAs} onChange={this.handleSaveCalibrationAsChange} />
        <MeasurePage step={this.state.index.step} params={this.state.params} value={this.state.calGroup} onChange={this.handleCalGroupChange} />
        <div id="console">
          Page {this.state.index.page}, step {this.state.index.step}
        </div>
      </div>
    );
  }
}

module.exports = Wizard;
