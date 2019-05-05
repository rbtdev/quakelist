import React, { Component } from "react";
import Earthquake from "./Earthquake";

class Earthquakes extends Component {
  state = { days: null };

  fetchQuakes = async () => {
    let response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    );
    let earthquakes = await response.json();

    let oneDayMs = 24 * 60 * 60 * 1000; // One day in MS
    let now = Date.now();

    let days = [];
    earthquakes.features.forEach(earthquake => {
      let delta = now - earthquake.properties.time;
      let day = Math.trunc(delta / oneDayMs);

      days[day] = days[day] || [];
      days[day].push(earthquake);
    });
    this.setState({ days: days });
  };

  async componentDidMount() {
    setInterval(this.fetchQuakes, 1000);
  }

  render() {
    let { days } = this.state;
    return (
      <div>
        {days && (
          <div>
            <div>
              {days.map((day, index) => (
                <div>
                  Days Ago: {index}
                  {day.map(feature => (
                    <Earthquake data={feature} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Earthquakes;
