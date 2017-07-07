import Section from './section.js';
import Item    from './item.js';
import React, { Component } from 'react';

function Sidebar(props) {
  let elements = [];
  if (props.sections) {
    for (let section of props.sections) {
      console.log('section: ' + section.name);
      elements.push(<Section key={section.name} name={section.name} />);
      if (section.items) {
        for (let item of section.items) {
          console.log('item: ' + item.name);
          elements.push(<Item key={item.name} name={item.name} active={!!item.active}/>);
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

export default Sidebar;
