import Section from './section.js';
import Item    from './item.js';
import React, { Component } from 'react';
import "../../assets/css/sidebar.scss";

function Sidebar(props) {
  let elements = [];
  if (props.sections && props.sections.length) {
    for (let section of props.sections) {
      elements.push(<Section key={section.name} name={section.name} underline={!!section.underline}/>);
      if (section.items && section.items.length) {
        for (let item of section.items) {
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
