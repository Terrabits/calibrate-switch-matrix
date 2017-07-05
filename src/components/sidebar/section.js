import React, { Component } from 'react';

function Section(props) {
  return (
    <h5 className="nav-group-title">
      {props.name}
    </h5>
  );
}

export default Section;
