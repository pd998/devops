import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom';
import noImage from '../img/download.jpeg';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';
import '../App.css';

const Venue = () => {
  const [venue, setVenue] = useState(undefined);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/venues/' + id + '.json?apikey='+ process.env.REACT_APP_API_KEY);
        setVenue(data);
        setLoading(false);
        if(data.images)
        {
          let max = 0;
          let index = 0;
          for(let i=0; i<data.images.length;i++)
            if(data.images[i].height*data.images[i].width > max)
            {
              max = data.images[i].height*data.images[i].width;
              index = i;
            }
          setImageIndex(index);
        }
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
  }, [id]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Card
        variant='outlined'
        sx={{
          maxWidth: 550,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid blue',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardHeader
          title={venue.name}
          sx={{
            borderBottom: '1px solid blue',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            venue.images && venue.images[imageIndex]
                    ? venue.images[imageIndex].url
                    : noImage
          }
          title='show image'
        />
        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='span'
            sx={{
              borderBottom: '1px solid blue',
              fontWeight: 'bold'
            }}
          >
            <dl>
              <div>
                <dt  className='fields'>Location: </dt>
                <dd>{venue.address ? <address>
                    {venue.address.line1},<br/>
                    <span className='inner-fields'>City: </span>{venue.city.name},<br/>
                    <span className='inner-fields'>State: </span>{ venue.state.name},<br/>
                    <span className='inner-fields'>Pincode: </span>{ venue.postalCode}<br/>
                    <span className='inner-fields'>Country: </span>{venue.country.name}
                    </address> : 'Location Not Available'}</dd>
              </div>
              <p>
                <dt className='fields'>Upcoming Events: </dt>
                <dd>
                  {venue.upcomingEvents
                  ? venue.upcomingEvents._total
                  : 'Upcoming Events Not Available'}
                </dd>
              </p>
              <p>
                <dt className='fields'>URL: </dt>
                <dd>
                  {venue.url
                  ? venue.url
                  : 'URL Not Available'}
                </dd>
              </p>
              <p>
                {venue.markets && <><dt className='fields'>Markets : </dt> <dd>{venue.markets.map((key, index)=>{
                  return <span key={index}>{key.name}<br/></span>
                })}</dd></>}
              </p>
              <p>
                {venue.social && <><dt className='fields'>Social : </dt> <dd>{Object.keys(venue.social).map((key, index)=>{
                  return <span key={index}><span className='inner-fields'>{key}: </span>{venue.social[key].handle} <br/></span>
                })}</dd></>}
              </p>
              <p>
                {venue.generalInfo && <><dt className='fields'>General Info: </dt> <dd>{venue.generalInfo.childRule && <><span className='inner-fields'>Child Rule: </span> {venue.generalInfo.childRule}</>}<br/>{venue.generalInfo.generalRule && <><span className='inner-fields'>General Rule: </span> {venue.generalInfo.generalRule}</>}</dd></>}
              </p>
              <p>
                {venue.accessibleSeatingDetail && <><dt className='fields'>Accessible Seating Detail : </dt> <dd>{venue.accessibleSeatingDetail}</dd></>}
              </p>
            </dl>
            <Link to='/venues'>Back to all venues...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Venue;
