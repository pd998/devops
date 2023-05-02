import React from 'react';
import logo from './img/Ticketmaster-logo.png';
import './App.css';
import EventList from './components/EventList';
import AttractionList from './components/AttractionList';
import VenueList from './components/VenueList';
import Event from './components/Event';
import Venue from './components/Venue';
import Attraction from './components/Attraction';
import Home from './components/Home';
import APIkey from './components/APIkey';
import PageNotFound from './components/PageNotFound';
import {BrowserRouter as Router, Route, Link, Routes, Navigate} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Welcome to the React.js Ticket master API
          </h1>
          <Link className='showlink' to='/'>
            Home
          </Link>
          <Link className='showlink' to='/events'>
            Events
          </Link>
          <Link className='showlink' to='/venues'>
            Venues
          </Link>
          <Link className='showlink' to='/attractions'>
            Attractions
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
						<Route exact path='/' element={<Home/>} />
            <Route exact path='/apikey' element={<APIkey/>} />
						<Route exact path='/events' element={<Navigate replace to={"/events/page/0"}/>} />
						<Route exact path='/events/page/:pagenum' element={<EventList/>} />
						<Route exact path='/events/:id' element={<Event/>} />
            <Route exact path='/venues' element={<Navigate replace to={"/venues/page/0"}/>} />
						<Route exact path='/venues/page/:pagenum' element={<VenueList/>} />
						<Route exact path='/venues/:id' element={<Venue/>} />
            <Route exact path='/attractions' element={<Navigate replace to={"/attractions/page/0"}/>} />
						<Route exact path='/attractions/page/:pagenum' element={<AttractionList/>} />
						<Route exact path='/attractions/:id' element={<Attraction/>} />
						<Route exact path='/pageNotFound' element={<PageNotFound/>}/>
						<Route path='*' element={<PageNotFound/>}/>
					</Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
