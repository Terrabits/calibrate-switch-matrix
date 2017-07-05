// const controls = projectRequire('controls.js')
// const python   = projectRequire('python.js')
// const onMeasureClicked = projectRequire('on-measure-clicked.js');
// const onMeasurementDefinitionButtonClicked = projectRequire('on-measurement-definition-button-clicked.js');

// Controls
// $('#measure-button').on('click', onMeasureClicked);
// $('#measurement-definition-button').on('click', onMeasurementDefinitionButtonClicked);

const Alert        = projectRequire('alert.js');
const {Controller} = projectRequire('controller.js');
const Model        = projectRequire('model.js');
const Wizard       = projectRequire('wizard.js');

const React    = nodeRequire('react');
const ReactDOM = nodeRequire('react-dom');

let model      = new Model();
let controller = new Controller(model, null);
let view = ReactDOM.render(
  <Wizard index={controller.index}/>,
  document.getElementById('wizard-root')
);
view.alert = ReactDOM.render(
  <Alert context="success" message="" />,
  document.getElementById('alert-root')
);

controller.view = view;
