'use client';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const latitude = Number(process.env.NEXT_PUBLIC_JSA_LATITUDE);
const longitude = Number(process.env.NEXT_PUBLIC_JSA_LONGITUDE);
const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0;

export default function LocationMap() {
  if (!mapsKey || !hasCoordinates) {
    return <iframe title="Jaffna Sports Academy location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Jaffna%20Sports%20Academy%2C%20Jaffna&output=embed" />;
  }

  const position = { lat: latitude, lng: longitude };
  return (
    <APIProvider apiKey={mapsKey}>
      <Map defaultCenter={position} defaultZoom={16} mapId="jsa-play-location" gestureHandling="cooperative" disableDefaultUI={false}>
        <Marker position={position} title="Jaffna Sports Aademy" />
      </Map>
    </APIProvider>
  );
}