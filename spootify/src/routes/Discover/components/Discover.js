import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import { redirectToOAuth, getAccessToken, fetchRequest } from "../../../services/SpotifyService";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  async componentDidMount() {
    // TODO optimize this for store token in to local storage
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const accessToken = await getAccessToken(code);
      this.fetch(accessToken);
    } else {
      redirectToOAuth();
    }
  }

  fetch(accessToken) {
    fetchRequest(accessToken, "/browse/new-releases").then(({ albums }) => {
      this.setState({
        newReleases: albums.items
      })
    });
    fetchRequest(accessToken, "/browse/categories").then(({ categories }) => {
      this.setState({
        categories: categories.items
      })
    });
    fetchRequest(accessToken, "/browse/featured-playlists").then(({ playlists }) => {
      this.setState({
        playlists: playlists.items
      })
    });

  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
