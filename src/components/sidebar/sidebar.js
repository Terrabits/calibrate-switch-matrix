import Section from './section.js';
import Item    from './item.js';
import React, { Component } from 'react';

class Sidebar extends Component {
  constructor( props ) {
    super( props );
  }
  render() {
    let elements = [];
    if (this.props.sections) {
      for (let section of this.props.sections) {
        elements.push(<Section key={section.name} name={section.name} />);
        if (section.items) {
          for (let item of section.items) {
            elements.push(<Item key={item.name} name={item.name} icon={item.icon}/>);
          }
        }
      }
    }
    return (
      <div className="pane-sm sidebar padded-more">
        <nav className="nav-group">
          {elements}
        </nav>
      </div>
    );
  }
}

export default Sidebar;
