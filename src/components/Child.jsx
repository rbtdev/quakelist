import React, { Component } from "react";
class Child extends Component {
  state = {};

  render() {
    return (
      <div>
        <div>
          My name is {this.props.name} and my age is: {this.props.age}
        </div>
        <button onClick={this.props.onClicked}>ChildButton</button>
      </div>
    );
  }
}

export default Child;
