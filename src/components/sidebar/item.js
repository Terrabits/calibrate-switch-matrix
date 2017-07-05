import React, { Component } from 'react';

function Item(props) {
  let icon = ''
  if (props.icon) {
    let className = `icon icon-${props.icon}`;
    icon = <span className={className}></span>
  }
  let className = ''
  if (props.active) {
    className = 'nav-group-item active';
  }
  else {
    className = 'nav-group-item';
  }
  return (
    <span className={className}>
      {icon}
      {props.name}
    </span>
  );
}

export default Item;
