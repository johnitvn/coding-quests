import React, { Component } from 'react';
import RocketCore from './RocketCore';

export function FunctionalRocket() {
  console.log("Functional Rocket Rendering");
  return <RocketCore id="functional-rocket" initialLaunchTime={Date.now()} />;
}

export class ClassRocket extends Component {
  render() {
    console.log("Class Rocket Rendering");
    return <RocketCore id="class-rocket" initialLaunchTime={Date.now()} />;
  }
}
