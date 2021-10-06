// import React, { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {jokes: []}

    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);

  }

  /* get jokes if there are no jokes */
  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    const {jokes} = this.state;

    let j = [...jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes: j});
    } catch (e) {
      console.log(e);
    }
  }


  generateNewJokes() {
    this.setState({jokes: []});
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    // setJokes(allJokes =>
    //   allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    // );
    this.setState({jokes : this.state.jokes.map(j => (
      j.id === id ? { ...j, votes: j.votes + delta } : j
    ))})
  }

  /* render: either loading spinner or list of sorted jokes. */
  render() {
    if (this.state.jokes.length < this.props.numJokesToGet) {
      return <h1>Loading</h1>
    }

    if (this.state.jokes.length === this.props.numJokesToGet) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }

    return null;
  }
}


export default JokeList;
