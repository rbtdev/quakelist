import React, { Component } from "react";
import moment from 'moment';
class Earthquake extends Component {
  state = {};

  render() {
    let { data, onClick } = this.props;
    let color = 'red'
    if (data.properties.mag < 3) color = 'green';
    else if (data.properties.mag >= 3 && data.properties.mag < 5) color = 'blue';
    else if (data.properties.mag >=5 && data.properties.mag < 7) color = 'orange';
    let magStyle = {
      position:'relative',
      width: '10%',
      bottom: '10px',
      display: 'inline-block',
      color: color,
    }
    let placeStyle = {}
    let timeStyle = {}
    let infoStyle = {
      fontSize: 'smaller',
      display: 'inline-block',
      width: '90%',
    }
    return (
      <div style = {{padding: '6px'}}>
          <div style = {magStyle}>{data.properties.mag}</div>
          <div style = {infoStyle}>
            <div style = {placeStyle}>{data.properties.place}</div>
            <div style = {timeStyle}>
              {moment(data.properties.time).format("MMM DD YYYY HH:mm:sss")} (about {moment(data.properties.time).fromNow()})</div>
          </div>
      </div>
    );
  }
}
//
export default Earthquake;

//05/05/19
