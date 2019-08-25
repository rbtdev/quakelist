import React, { Component } from "react";
import moment from 'moment';
class Earthquake extends Component {
  state = {};

  render() {
    let mag = mStr => (parseFloat(mStr).toFixed(1))
    let { data } = this.props;
    let color = 'red'
    if (data.properties.mag < 3) color = 'green';
    else if (data.properties.mag >= 3 && data.properties.mag < 5) color = 'blue';
    else if (data.properties.mag >=5 && data.properties.mag < 7) color = 'orange';
    let quakeStyle = {
      padding: '6px',
      marginTop: '3px',
      marginBottom: '3px',
      borderRadius: '3px',
      backgroundColor: data._isNew?'lightgreen':'white',
      border: '1px solid gray'
    }
    let magStyle = {
      position:'relative',
      width: '15%',
      bottom: '10px',
      display: 'inline-block',
      color: color,
      textAlign: 'center'
    }
    let placeStyle = {}
    let timeStyle = {}
    let infoStyle = {
      fontSize: 'smaller',
      display: 'inline-block',
      width: '90%',
    }
    return (
      <div style = {quakeStyle}>
          <div style = {magStyle}>{mag(data.properties.mag)}</div>
          <div style = {infoStyle}>
            <div style = {placeStyle}>{data.properties.place}</div>
            <div style = {timeStyle}>
              {moment(data.properties.time).format("MMM DD YYYY HH:mm:ss.SSS")} ({moment(data.properties.time).fromNow()})</div>
          </div>
      </div>
    );
  }
}

export default Earthquake;
