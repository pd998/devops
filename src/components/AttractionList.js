import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Search from './Search';
import noImage from '../img/download.jpeg';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';

import '../App.css';

const AttractionList = () => {
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [attractionsData, setAttractionsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const navigate = useNavigate();
  let {pagenum} = useParams();
  let card = null;
  useEffect(() => {
    async function fetchData() {
      try {
				const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/attractions.json?countryCode=US&apikey='+ process.env.REACT_APP_API_KEY + '&size=' + pageSize + '&page='+pagenum);
				setAttractionsData(data._embedded.attractions);
				setLoading(false);
			} catch (e) {
				navigate('/pageNotFound');
			}
    }
    if(!process.env.REACT_APP_API_KEY)
    {
      navigate('/apikey');
      return;
    }
    fetchData();
  }, [pagenum, pageSize]);

  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await axios.get('https://app.ticketmaster.com/discovery/v2/attractions.json?countryCode=US&apikey=' + process.env.REACT_APP_API_KEY + '&keyword=' + searchTerm);
        if(data._embedded)
          setSearchData(data._embedded.attractions);
        setLoading(false);
      } catch (e) {
      }
    }
    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm]);

  const handleChange = (e)=>{
    setPageSize(e.target.value);
    navigate('/attractions/page/'+ Math.floor((pagenum*pageSize)/e.target.value))
  }
  const searchValue = (value) => {
    setSearchTerm(value);
  };
  const buildCard = (attraction) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={attraction.id}>
        <Card
          variant='outlined'
          sx={{
            maxWidth: 250,
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 5,
            border: '1px solid blue',
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}
        >
          <CardActionArea>
            <Link to={`/attractions/${attraction.id}`}>
              <CardMedia
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component='img'
                image={
                  attraction.images && attraction.images[0]
                    ? attraction.images[0].url
                    : noImage
                }
                title='attraction image'
              />

              <CardContent>
                <Typography
                  sx={{
                    borderBottom: '1px solid blue',
                    fontWeight: 'bold'
                  }}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {attraction.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {attraction.classifications
                    ? <><span className='fields'>Genre: </span> {attraction.classifications[0].genre.name}</>
                    : 'Genre Not Available'}
                    <br/>
                  {attraction.upcomingEvents
                    ? <><span className='fields'>Upcoming Events: </span>{attraction.upcomingEvents._total}</>
                    : 'Upcoming Events Not Available'}
                    <br/>
                  <span className='fields'> More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };
const getOptions =()=>{
  let option = [];
  for(let i=5;i<100;i+=5)
    option.push(<option value={i} key={i}>{i}</option>)
  return option;
}
  if (searchTerm) {
    card =
      searchData &&
      searchData.map((attraction) => {
        return buildCard(attraction);
      });
  } else {
    card =
      attractionsData &&
      attractionsData.map((attraction) => {
        return buildCard(attraction);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <Search searchValue={searchValue} searchCaller={"attractions"}/>
        <br />
        <br />
        {!searchTerm && <>Page size:
        <select onChange={handleChange} value={pageSize}>
          {getOptions()}
        </select></>}
        {!searchTerm && <div>{pagenum!=0 && <Link to={`/attractions/page/${parseInt(pagenum) - 1}`}>Previous</Link>} {pagenum<(1000/pageSize)-1 && <Link to={`/attractions/page/${parseInt(pagenum) + 1}`}>Next</Link>}</div>}
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
};

export default AttractionList;
