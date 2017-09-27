import Section from './section.js';
import Item    from './item.js';
import React, { Component } from 'react';

import "../../assets/css/sidebar.scss";

function Sidebar(props) {
  const elements = [];
  const sections = props.sections ? props.sections : [];
  for (const section of sections) {
    elements.push(
      <Section key={section.name}
               name={section.name}
               active={section.active}
               index={section.index}
               onClick={props.onClick} />
    );
    const items = section.items ? section.items : [];
    for (const item of items) {
      elements.push(
        <Item key={item.name}
              name={item.name}
              active={item.active}
              index={item.index}
              onClick={props.onClick} />
      );
    }
  }
  return (
    <div id="sidebar" className="pane-sm sidebar">
      <nav className="nav-group">
        {elements}
      </nav>
    </div>
  );
}

export default Sidebar;
