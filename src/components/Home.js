import React from 'react';
import '../App.css';

const Home = () => {
  return (
    <div>
      This website is based on Ticketmaster API. I would like to describe functionality of this website so basically users can select any one of events, venues and attractions and it page wise displays all available data the user requested. Also users can individually select any of the event, venue and attraction for more information. Users have capability of selecting page size and the website will automatically count page number and redirect users to that page according to previous page size and current display item. Users can search any event, venue or attraction. Also the website displays the first image in the list view but for individual item pages, it will display the best image available.
    </div>
  );
};

export default Home;
