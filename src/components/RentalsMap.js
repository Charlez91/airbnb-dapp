import React, { useEffect, useState } from "react";
import {Map, Marker, GoogleApiWrapper} from "google-maps-react";
require('dotenv').config();

const apiKey = process.env.APIKEY
 

function RentalsMap({locations,google, setHighLight}) {
  const [center, setCenter] = useState();
  useEffect(()=>{
    let arr = Object.keys(locations);
    let getLat = (key) => locations[key]["lat"]
    let avgLat = arr.reduce((a,c)=> a + Number(getLat(c)), 0)/ arr.length;

    let getLng = (key) => locations[key]["lat"]
    let avgLng = arr.reduce((a,c)=> a + Number(getLng(c)), 0)/ arr.length;

    setCenter({lat:avgLat, lng:avgLng})
  }, [locations])

  return (
    <>
    {center &&(
      <Map 
        google={google}   
        containerStyle={{width:"50vw", height:"calc(100vh - 135px)",}}   
        center={center}
        initialCenter={locations[0]}
        zoom = {13}
        disableDefaultUI={true}
      >
        {locations.map((coords, i)=>(
          <Marker position={coords} onClick={()=>setHighLight(i)} />
        ))}
      </Map>
    )}
      
    </>
  );
}

export default GoogleApiWrapper({apiKey:apiKey}) (RentalsMap);
