import React, { Component } from "react";
import Earthquake from "./Earthquake";
import _ from 'lodash';

const CHECK_FEED_MS = 60000; // 1 min
const FEEDS = [
  {
    title: 'Last Hour: Significant Earthquakes',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson'
  },
  {
    title: 'Last Hour: >= Mag 4.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson'
  },
  {
    title: 'Last Hour: >= Mag 2.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson'
  },
  {
    title: 'Last Hour: >= 1.0',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson'
  },
  {
    title: 'Last Hour: All',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
  },


  {
    title: 'Last Day: Significant Earthquakes',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson'
  },
  {
    title: 'Last Day: >= Mag 4.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson'
  },
  {
    title: 'Last Day: >= Mag 2.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
  },
  {
    title: 'Last Day: >= 1.0',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson'
  },
  {
    title: 'Last Day: All',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
  },

  {
    title: 'Last Week: Significant Earthquakes',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson'
  },
  {
    title: 'Last Week: >= Mag 4.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'
  },
  {
    title: 'Last Week: >= Mag 2.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
  },
  {
    title: 'Last Week: >= 1.0',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson'
  },
  {
    title: 'Last Week: All',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
  },

  {
    title: 'Last Month: Significant Earthquakes',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
  },
  {
    title: 'Last Month: >= Mag 4.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
  },
  {
    title: 'Last Month: >= Mag 2.5',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'
  },
  {
    title: 'Last Month: >= 1.0',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson'
  },
  {
    title: 'Last Month: All',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
  }
]
class QuakeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    }
  }

  render() {
    let { isOpen } = this.state;
    let { quakes, newCount } = this.props;
    return (
      <div style={{ textAlign: 'left', marginTop: "20px" }}>
        <div>{quakes.length} Earthquake{quakes.length !== 1 ? 's' : ''} {newCount ? `(${newCount} new)` : ''}</div>
        {(quakes.length && isOpen) ?
          <div>
            <div style={{
              textAlign: 'left',
              width: '100%',
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
  constructor(props) {
    super(props);

    this.changeFeed = this.changeFeed.bind(this);
    this.fetchQuakes = this.fetchQuakes.bind(this);

    this.state = {
      firstLoad: true,
      earthquakes: [],
      newQuakeCount: 0,
      feedInfo: null,
      testQuakes: [],
      countDown: CHECK_FEED_MS / 1000,
      currentFeed: 7
    };

    this.earthquakes = [];
    this.fetchTimer = null;
    this.countdownTimer = null;
  }

  fetchQuakes = async () => {
    let { currentFeed } = this.state;
    let response = await fetch(FEEDS[currentFeed].url);
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
    }

    earthquakes.sort((a, b) => (b.properties.time - a.properties.time));
    clearInterval(this.countdownTimer);
    clearTimeout(this.fetchTimer);
    let countDown = CHECK_FEED_MS / 1000;
    if (currentFeed > 16) {
      countDown = -1;
    }
    else {
      this.fetchTimer = setTimeout(this.fetchQuakes, CHECK_FEED_MS);
      this.countdownTimer = setInterval(() => { this.setState({ countDown: this.state.countDown - 1 }) }, 1000)
    } 
    this.setState({ firstLoad: false, countDown , feedInfo: feed.metadata, newQuakeCount: newQuakes.length, earthquakes });
  };

  changeFeed(e) {
    let currentFeed = e.target.value;
    let firstLoad = true;
    this.setState({ currentFeed, firstLoad });
  }

  render() {
    let refreshMessage = () => {
      if (this.state.countDown >= 0) return (
          <span>
            Checking USGS in {this.state.countDown} seconds
          </span>
      )
      else return (
          <span>
            Auto refresh disabled for this feed
          </span>
      )
    }
    
    if (this.state.firstLoad) this.fetchQuakes();

    return (
      <div style={{ textAlign: 'left', margin: '10px', width: '100%' }}>
        <div>
          <select id="feed-select" value={this.state.currentFeed} onChange={this.changeFeed}>
            {FEEDS.map((feed, i) => (
              <option value={i}>{feed.title}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: 'larger' }}>
          {this.state.feedInfo && this.state.feedInfo.title}
        </div>
        <div>
          {refreshMessage()}
          <span>
            <button onClick={this.fetchQuakes}>Refresh</button>
          </span>
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
