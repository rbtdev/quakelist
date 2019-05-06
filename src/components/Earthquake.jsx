import React, { Component } from "react";
class Earthquake extends Component {
  state = {};

  render() {
    let { data } = this.props;
    let color = 'red'
    if (data.properties.mag < 3) color = 'green';
    else if (data.properties.mag >= 3 && data.properties.mag < 5) color = 'blue';
    else if (data.properties.mag >=5 && data.properties.mag < 7) color = 'orange';
    let magStyle = {
      width: '40px',
      display: 'inline-block',
      color: color,
      marginLeft: '40px'
    }
    let placeStyle = {
      display: 'inline-block',
      color: color
    }
    return (
      <div style = {{padding: '3px'}}>
        <a href={data.properties.url}>
          <div style = {magStyle}>{data.properties.mag}</div><div style = {placeStyle}>{data.properties.place}</div>
        </a>
      </div>
    );
  }
}
//
export default Earthquake;

//05/05/19
