'use client'
import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { Box, Typography } from '@mui/material';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

export default function AddSpot() {
  const [ open, setOpen ] = useState(false);
  const [ formState, setFormState ] = useState({});
  const [ error, setError ] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCszSIw3d3Q_UQkZrCTt50byd9MIoBqsTQ"
  })

  const [map, setMap] = useState(null)
  const [center, setCenter] = useState({
      lat: 35.305,
      lng: -120.6625
  })
  const [markerPosition, setMarkerPosition] = useState(center);

  const onMapDoubleClick = useCallback((event) => {
    setMarkerPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
    });
}, []);

  const onLoad = useCallback(function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      findLocation()
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map)
  }, [center])

  const onUnmount = useCallback(function callback(map) {
      setMap(null)
  }, [])  

  function handleAddButton() {
    setOpen(true);
    setFormState({});
  }

  function handleClose() {
    setOpen(false);
  }

  const findLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            setMarkerPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
};

  return (
    <>
      <Button variant="underlined" color="inherit" onClick={handleAddButton}>Add Spot</Button>
      {open && 
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Study Spot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To Add a new spot, please fill in the following fields.
          </DialogContentText>
          { error ? (
            <Alert severity="error">There was an issue submitting the study spot, please adjust the fields and try again.</Alert>
          ) : null }
          <TextField
            autoFocus
            margin="dense"
            id="spotName"
            name="spotName"
            label="Spot Name"
            type="spotName"
            fullWidth
            variant="standard"
            required
     
          />
          <TextField
            margin="dense"
            id="building"
            name="building"
            label="Building"
            type="building"
            required
            fullWidth
            variant='standard'/>
          <TextField
            margin="dense"
            name="capacity"
            id="SpotCap"
            label="Spot Capacity"
            inputProps={{min: 0}}
            type="number"
            required
            fullWidth
            variant='standard'/>
            
          {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={{width: '100%', height: '200px'}}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onDblClick={onMapDoubleClick}
                    disableZoom={true}
                    options={{
                        styles: [
                            {
                                elementType: 'labels.icon',
                                stylers: [{visibility: 'off'}]
                            }
                        ]
                    }}
                >
                  <Marker position={markerPosition}></Marker>
                </GoogleMap>
        ) : <></>}  
        <DialogContentText>Please mark the spot on the map</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit for Review</Button>
        </DialogActions>
        
      </Dialog>}
    </>
  );
}


