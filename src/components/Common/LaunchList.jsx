import { useState, useCallback, useEffect, useMemo} from "react";
import { CircularProgress, Grid } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import moment from "moment";

const LaunchItemContainer = styled.div`
  display: flex;
  flex-direction: column;

`;
const RocketImg = styled.img`
  width: 160px;
`;

const GridStyled = styled(Grid)`
  padding: 64px;
`

const MAX_DISPLAY = 9;

const LaunchItem = ({launch}) => {
  const [isFav, setIsFav] = useState(false);
  
  useEffect(()=>{
    const favourites = sessionStorage.getItem('favourite')?.split(',') || [];
    setIsFav(!!favourites.find(favourite => launch.flight_number.toString() === favourite));
  },[launch]);
  
  const navigate = useNavigate();

  const launchClickHandler = useCallback(()=>{
    navigate(`/details/${launch.rocket.rocket_id}`, { replace: true });
  }, [launch.rocket.rocket_id, navigate]);

  const addFavourite = useCallback(()=>{
    let data = sessionStorage.getItem('favourite')?.split(',') || [];
    data.push(launch.flight_number)
    sessionStorage.setItem('favourite', data);
    setIsFav(true);
  }, [launch.flight_number]);

  const removeFavourite = useCallback(()=>{
    let data = sessionStorage.getItem('favourite')?.split(',') || [];
    let filtered = data.filter(elem => elem !== launch.flight_number.toString());
    sessionStorage.setItem('favourite', filtered);
    setIsFav(false);
  }, [launch.flight_number]);

  return <LaunchItemContainer>
    <RocketImg src={launch.rocket.flickr_images[0]} alt={launch.flight_number} onClick={launchClickHandler}/>
    <span>
    {launch.rocket.rocket_name}
    </span>

    <span>
    {moment(launch.launch_date_utc).format("MMMM DD, YYYY")}
    </span>
    {isFav ? (
      <span className="material-icons" onClick={removeFavourite}>
          star
      </span>
    ) : (
      <span className="material-icons" onClick={addFavourite}>
          star_border
      </span>
    )}
  </LaunchItemContainer>
}


const LaunchList = ({ launches = [] }) => {
  const [pagination, setPagination] = useState(0);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    return launches.filter(launch => launch.rocket.rocket_name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter, launches]);

  return (
    <div>
      { launches.length === 0 && <CircularProgress />}
      <span>Total: {filtered.length}</span>
      <input type="text" onChange={e => setFilter(e.target.value)} value={filter} placeholder="Search all launches..."/>
      <GridStyled container spacing={2}>
      { filtered.length > 0 && filtered?.slice(pagination, MAX_DISPLAY).map(launch => (
        <Grid item xs={4} key={launch.flight_number + launch.mission_name}>
          <LaunchItem launch={launch} />
        </Grid>
      ))}
      </GridStyled>
    </div>
  )
};

export default LaunchList;