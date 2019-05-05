import React, { Component } from "react";
class Child extends Component {
  state = {};

  render() {
    return (
      <div>
        I'm the child. My name is {this.props.name}
        <div>My age is: {this.props.age}</div>
        <button onClick={this.props.onClicked}>ChildButton</button>
      </div>
    );
  }
}

export default Child;
