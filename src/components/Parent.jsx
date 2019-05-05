import React, { Component } from "react";
import Child from "./Child";
class Parent extends Component {
  state = {
    name: "",
    age: "",
    clickedName: "",
    clickedAge: "",
    children: [
      {
        name: "Caleb",
        age: 40
      },
      {
        name: "Rob",
        age: 55
      }
    ]
  };

  createChild = () => {
    if (this.state.name && this.state.age) {
      let newChild = { name: this.state.name, age: this.state.age };
      let newChildren = [...this.state.children];
      newChildren.push(newChild);
      this.setState({ children: newChildren });
    }
  };

  nameChanged = ev => {
    let name = ev.target.value;
    this.setState({ name: name });
  };

  ageChanged = ev => {
    let age = ev.target.value;
    this.setState({ age: age });
  };

  // componentDidMount = () => {
  //   setInterval(this.createChild, 500);
  // };

  //CLOSURE
  //contains the function and the local scope of the function
  // with all the variables (environment) when the closure was created
  childClicked = (name, age) => () => {
    this.setState({ clickedName: name, clickedAge: age });
  };

  render() {
    return (
      <div>
        <button onClick={this.createChild}>Add Child</button>
        <input placeholder={"name"} onChange={this.nameChanged} />
        <input placeholder={"age"} onChange={this.ageChanged} />
        {this.state.clickedName} {this.state.clickedAge}
        {this.state.children.map(child => (
          <Child
            name={child.name}
            age={child.age}
            onClicked={this.childClicked(child.name, child.age)}
          />
        ))}
      </div>
    );
  }
}

export default Parent;
