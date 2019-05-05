import React, { Component } from "react";
class Earthquake extends Component {
  state = {};
  render() {
    let { data } = this.props;
    return (
      <div>
        <a href={data.properties.url}>
          {data.properties.mag} - {data.properties.place}
        </a>
      </div>
    );
  }
}
//
export default Earthquake;

//05/05/19
