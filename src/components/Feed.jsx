import React, { Component } from "react";
import Earthquake from "./Earthquake";
import _ from 'lodash';

const CHECK_FEED_MS = 60000; // 1 min
const FEEDS = {
  HOUR_ALL: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
  DAY_2_5: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
}
class QuakeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    }
  }

  render() {
    let { isOpen } = this.state;
    let { quakes, newCount, onClear } = this.props;
    return (
      <div style={{ textAlign: 'left', marginTop: "20px" }}>
        <div>{quakes.length} Earthquake{quakes.length !== 1 ? 's' : ''} {newCount ? `(${newCount} new)` : ''}</div>
        {(quakes.length && isOpen) ?
          <div>
            <div style={{
              textAlign: 'left',
              width: '450px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}>
              {quakes.map(quake => (<Earthquake data={quake} />))}
            </div>
          </div>
          : null}
      </div>
    )
  }
}

class Feed extends Component {
  state = {
    firstLoad: true,
    earthquakes: [],
    newQuakeCount: 0,
    feedInfo: null,
    testQuakes: [],
    countDown: CHECK_FEED_MS / 1000
  };

  earthquakes = [];
  fetchQuakes = async () => {
    let response = await fetch(FEEDS.HOUR_ALL);
    let feed = await response.json();
    let earthquakes = feed.features;
    let oldQuakes = [];
    let newQuakes = [];
    if (!this.state.firstLoad) {
      oldQuakes = [...this.state.earthquakes];
      oldQuakes.forEach(quake => { quake._isNew = false });
      newQuakes = _.differenceBy(feed.features, oldQuakes, 'id');
      newQuakes.forEach(quake => { 
        let newQuake = earthquakes.find(_quake => (quake.id === _quake.id));
        newQuake._isNew = true
      });

      earthquakes
        .sort((a, b) => (b.properties.time - a.properties.time));
    }

    this.setState({ firstLoad: false, countDown: CHECK_FEED_MS / 1000, feedInfo: feed.metadata, newQuakeCount: newQuakes.length, earthquakes });

  };

  async componentDidMount() {
    this.fetchQuakes();
    setInterval(this.fetchQuakes, CHECK_FEED_MS);
    setInterval(() => { this.setState({ countDown: this.state.countDown - 1 }) }, 1000)
  }

  render() {
    return (
      <div style={{ textAlign: 'left', marginLeft: '40px', width: '600px'}}>
        <div style={{ fontSize: 'larger'}}>
          {this.state.feedInfo && this.state.feedInfo.title}
        </div>
        <div>
          Checking USGS in {this.state.countDown} seconds
        </div>
        <QuakeList
          quakes={this.state.earthquakes}
          newCount={this.state.newQuakeCount}
        />
      </div>
    );
  }
}

export default Feed;
