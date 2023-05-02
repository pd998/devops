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

const Event = () => {
  const [event, setEvent] = useState(undefined);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/events/' + id + '.json?apikey=' + process.env.REACT_APP_API_KEY);
        setEvent(data);
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
          title={event.name}
          sx={{
            borderBottom: '1px solid blue',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            event.images && event.images[imageIndex]
                    ? event.images[imageIndex].url
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
            <p>
                <dt className='fields'>Venue: </dt>
                <dd>{event._embedded && event._embedded.venues
                  ? event._embedded.venues[0].name + ', ' + event._embedded.venues[0].city.name + ", " + event._embedded.venues[0].state.name
                  : 'Price Range Not Available'}</dd>
              </p>
              <p>
                <dt className='fields'>Price Range: </dt>
                <dd>{event.priceRanges
                  ? event.priceRanges[0].min + ' - ' + event.priceRanges[0].max + " " + event.priceRanges[0].currency
                  : 'Price Range Not Available'}</dd>
              </p>
              <p>
                <dt className='fields'>Start Date: </dt>
                <dd>
                  {event.dates && event.dates.start
                  ? new Date(event.dates.start.dateTime).toString().substring(0,15)
                  : 'Start Date Not Available'}
                </dd>
              </p>
              <p>
                <dt className='fields'> Start Time: </dt>
                <dd>
                  {event.dates && event.dates.start
                  ? new Date(event.dates.start.dateTime).toLocaleTimeString('en-US')
                  : 'Start Time Not Available'}
                </dd>
              </p>
              <p>
                {event.pleaseNote && <><dt className='fields'>Special Note : </dt> <dd>{event.pleaseNote}</dd></>}
              </p>
              <p>
                {event.promoter && <><dt className='fields'>Promoters : </dt> <dd>{event.promoter.name}</dd></>}
              </p>
              <p>
                <dt className='fields'> Seatmap : </dt>
                <dd>
                  <CardMedia
                    component='img'
                    image={
                      event.seatmap && event.seatmap.staticUrl
                              ? event.seatmap.staticUrl
                              : noImage
                    }
                    title='show image'
                  />
                </dd>
              </p>
            </dl>
            <Link to='/events'>Back to all events...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Event;
