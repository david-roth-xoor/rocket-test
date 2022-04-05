import { useState } from "react";
import { CircularProgress, Grid } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { useCallback } from "react";


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
  const navigate = useNavigate();

  const launchClickHandler = useCallback(()=>{
    navigate(`/details/${launch.flight_number}`, { replace: true });
  }, [launch.flight_number, navigate]);

  return <LaunchItemContainer  onClick={launchClickHandler}>
    <RocketImg src={launch.rocket.flickr_images[0]} alt={launch.flight_number} />
    {launch.rocket.rocket_name}
  </LaunchItemContainer>
}


const LaunchList = ({ launches = [] }) => {
  const [pagination, setPagination] = useState(0);
  const [filter, setFilter] = useState('');

  return (
    <div>
      { launches.length === 0 && <CircularProgress />}
      <span>Total: {launches.length}</span>
      <input type="text" onChange={e => setFilter(e.target.value)} value={filter} placeholder="Search all launches..."/>
      <GridStyled container spacing={2}>
      { launches.length > 0 && launches?.slice(pagination, MAX_DISPLAY).map(launch => (
        <Grid item xs={4} key={launch.flight_number}>
          <LaunchItem launch={launch} />
        </Grid>
      ))}
      </GridStyled>
    </div>
  )
};

export default LaunchList;