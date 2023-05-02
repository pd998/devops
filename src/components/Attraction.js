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

const Attraction = () => {
  const [attraction, setAttraction] = useState(undefined);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/attractions/' + id + '.json?apikey=' + process.env.REACT_APP_API_KEY);
        setAttraction(data);
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
          title={attraction.name}
          sx={{
            borderBottom: '1px solid blue',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            attraction.images && attraction.images[imageIndex]
                    ? attraction.images[imageIndex].url
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
                {attraction.aliases && <><dt className='fields'>Aliases : </dt> <dd>{attraction.aliases.map((key,index)=>{
                  return <span key={index}>{key}<br/></span>
                })}</dd></>}
            </p>
            <p>
                <dt className='fields'>Genre: </dt>
                <dd>
                  {attraction.classifications[0].genre.name
                  ? attraction.classifications[0].genre.name
                  : 'Upcoming Events Not Available'}
                </dd>
              </p>
            <p>
                <dt className='fields'>Upcoming Events: </dt>
                <dd>
                  {attraction.upcomingEvents
                  ? attraction.upcomingEvents._total
                  : 'Upcoming Events Not Available'}
                </dd>
              </p>
              <p>
                <dt className='fields'>URL: </dt>
                <dd>
                  {attraction.url
                  ? attraction.url
                  : 'URL Not Available'}
                </dd>
              </p>
              <p>
                {attraction.externalLinks && <><dt className='fields'>Social : </dt> <dd>{Object.keys(attraction.externalLinks).map((key,index)=>{
                  return <span key={index}><span className='inner-fields'>{key}: </span>{attraction.externalLinks[key][0].url} <br/></span>
                })}</dd></>}
              </p>
            </dl>
            <Link to='/attractions'>Back to all attractions...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Attraction;
