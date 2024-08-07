import { useParams } from 'react-router-dom';

function CityDetails() {
  const { name } = useParams();

  return (
    <div>
      <h1>City: {name}</h1>
     </div>
  );
}

export default CityDetails;
