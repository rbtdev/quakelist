import React, { Component } from "react";
import Earthquake from "./Earthquake";
import _ from 'lodash';

const CHECK_FEED_MS = 60000; // 1 min

class NewQuakes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    }
  }

  render() {
    let { isOpen } = this.state;
    let { quakes, onClear } = this.props;
    let buttonStyle = {
      padding: '5px',
      margin: '10px',
      display: 'inline-block'
    }
    return (
      <div style={{ marginTop: "20px" }}>
        <div>{quakes.length} New Earhqauke{quakes.length !== 1?'s':''}
        {quakes.length ?
            <button
              style={buttonStyle}
              onClick={() => { this.setState({ isOpen: !isOpen }) }}>{isOpen ? 'Close' : 'Open'}
            </button>
            : null}
        </div>

        {(quakes.length && isOpen) ?
          <div>
            <button style={buttonStyle} onClick={ () => {this.setState({isOpen: false}); onClear()}}>Clear</button>
            <div style={{
              textAlign: 'left',
              width: '600px',
              whiteSpace:'nowrap',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              {quakes.map(quake => (<Earthquake data={quake}/>))}
            </div>
          </div>
          : null}
      </div>
    )
  }
}

class EarthquakeList extends Component {
  state = {
    newQuakes: [],
    feedInfo: null,
    testQuakes: [],
    countDown: CHECK_FEED_MS/1000
  };

  earthquakes = [];

  fetchQuakes = async () => {
    let response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    );
    let feed = await response.json();
    let newQuakes = this.state.newQuakes
      .concat(_.differenceBy(feed.features, this.earthquakes, 'id'))
      .sort((a,b) => (b.properties.time - a.properties.time));
    this.setState({ countDown:CHECK_FEED_MS/1000, feedInfo: feed.metadata, newQuakes: newQuakes });
    this.earthquakes = feed.features;
  };

  async componentDidMount() {
    this.fetchQuakes();
    setInterval(this.fetchQuakes, CHECK_FEED_MS);
    setInterval(()=>{this.setState({countDown: this.state.countDown-1})}, 1000)
  }

  render() {
    return (
      <div style = {{width: '600px', margin: '0 auto'}}>
        <div style={{ fontSize: 'larger', margin: '20px' }}>
          {this.state.feedInfo && this.state.feedInfo.title}
        </div>
        <div>
          Checking USGS in {this.state.countDown} seconds
        </div>
        <NewQuakes quakes={this.state.newQuakes} onClear={() => {this.setState({ newQuakes: [] })}} />
      </div>
    );
  }
}

export default EarthquakeList;
