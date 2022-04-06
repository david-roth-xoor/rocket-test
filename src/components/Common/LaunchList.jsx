import { useState, useCallback, useEffect, useMemo} from "react";
import { CircularProgress, Grid, Pagination, Stack } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import moment from "moment";

const LaunchItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
`;

const RocketImg = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) -9.83%, rgba(0, 0, 0, 0.61) 99.51%), url(${props => props.src});
  border-radius: 8px;
  height: 157px;
  margin-bottom: 10px;
  background-size: 100% 100%;
`;

const GridStyled = styled(Grid)`
  padding: 0 64px 60px;
`

const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  padding: 10px;
`;

const Description = styled.span`
  font-size: 16px;
  line-height: 24px;
  padding: 10px;
`;

const Date = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.37);
  padding: 10px;
`;

const Stars = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

const Total = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  color: rgba(255, 255, 255, 0.47);
  padding: 0 64px;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
`;

const SearchBox = styled.input`
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #121212;
  border-radius: 8px;
  width: 414px;
  height: 47px;
  border: 0px;
  margin: 20px 64px 0;
  padding: 0 30px;
  color: white;
`;

const StyledStack = styled(Stack)`
  display: flex;
  justify-content: end;
  padding: 10px 50px;
  ul {
    justify-content: end;
  }
  .MuiPaginationItem-root {
    color: white!important;
  }
  .Mui-selected {
    background-color: white!important;
    color: #121212!important;
  }
  svg {
    fill: white!important;
  }
`;

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
    <Title>
      {launch.rocket?.rocket_name}
    </Title>

    <Description>
      {launch.rocket?.description}
    </Description>

    <Date>
      {moment(launch.launch_date_utc).format("MMMM DD, YYYY")}
    </Date>
    {isFav ? (
      <Stars className="material-icons" onClick={removeFavourite}>
          star
      </Stars>
    ) : (
      <Stars className="material-icons" onClick={addFavourite}>
          star_border
      </Stars>
    )}
  </LaunchItemContainer>
}


const LaunchList = ({ launches = [] }) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    return launches.filter(launch => launch.rocket?.rocket_name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter, launches]);

  const handleChangePagination = useCallback((event, value) => {
    setPage(value);
  }, []);


  return (
    <div>
      { launches.length === 0 ? (
        <Loading>
          <CircularProgress />
        </Loading>
      ) : (
        <>
          <SearchBox type="text" onChange={e => setFilter(e.target.value)} value={filter} placeholder="Search all launches..."/>
          <Total>Total ({filtered.length})</Total>
          <GridStyled container spacing={2}>
          { filtered.length > 0 && filtered?.slice((page - 1)*MAX_DISPLAY, page*MAX_DISPLAY).map(launch => (
            <Grid item xs={12} md={6} lg={4}  key={launch.flight_number + launch.mission_name}>
              <LaunchItem launch={launch} />
            </Grid>
          ))}
          </GridStyled>
          <StyledStack>
            <Pagination count={Math.ceil(filtered.length / 9)} page={page} onChange={handleChangePagination} />
          </StyledStack>
        </>
      )
    }

    </div>
  )
};

export default LaunchList;