import React, { Component } from 'react';
import RocketCore from './RocketCore';
import _ from 'lodash';

export const FunctionalRocket = React.memo(() => {
  console.log("Functional Rocket Rendering");
  return <RocketCore initialLaunchTime={Date.now()} />;
});

export class ClassRocket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialLaunchTime: Date.now()
    };
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  render() {
    console.log("Class Rocket Rendering");
    const { initialLaunchTime } = this.state;
    return <RocketCore initialLaunchTime={initialLaunchTime} />;
  }

}