import { Plane } from "react-loader-spinner";
import "./Heading.css";

const Heading = ({ image }) => {
  return (
    <div>
      <div className='image-container'>
        {!image && (
          <Plane
            ariaLabel='loading-indicator'
            color='#e5771b'
            secondaryColor='white'
          />
        )}
        {image && (
          <img className='profile-image' src={image} alt='profile pic' />
        )}
      </div>
    </div>
  );
};

export default Heading;
