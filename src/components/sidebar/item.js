import React, { Component } from 'react';

function Item(props) {
  let icon = ''
  if (props.icon) {
    let className = `icon icon-${props.icon}`;
    icon = <span className={className}></span>
  }
  const classes = ['nav-group-item'];
  if (props.active) {
    classes.push('active');
  }
  const handleClick = () => {
    if (props.onClick) {
      props.onClick(props.index);
    }
    else {
      console.log(`${props.name} clicked`);
    }
  }
  return (
    <span className={classes.join(' ')} onClick={handleClick}>
      {icon}
      {props.name}
    </span>
  );
}

export default Item;
