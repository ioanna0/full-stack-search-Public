import { useParams } from 'react-router-dom';

function HotelDetails() {
  const { name } = useParams();

  return (
    <div>
      <h1>Hotel: {name}</h1>
    </div>
  );
}

export default HotelDetails;
