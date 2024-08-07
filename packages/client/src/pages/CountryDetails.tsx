import { useParams } from 'react-router-dom';

function CountryDetails() {
  const { name } = useParams();

  return (
    <div>
      <h1>Country: {name}</h1>
    </div>
  );
}

export default CountryDetails;
