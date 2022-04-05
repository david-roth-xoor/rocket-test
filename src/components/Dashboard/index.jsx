import Axios from "axios";
import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";

import { ReactComponent as Logo} from '../../assets/Logo.svg';
import Favourite from "../Favourite";
import LaunchList from "./LaunchList";

const ContainerDashboard = styled.div`
  background-color: #121212;
  height: fill-available;
  color: white;
  min-height: 100vh;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 39px;
`;

const Title = styled.span`
  font-family: 'D-DIN';
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
`;

const Dashboard = () => {
  const [launchesList, setLaunchesList] = useState([]);
  const [rocketList, setRocketsList] = useState([]);
  const [menu, setMenu] = useState('All');

  useEffect(()=>{
    Axios({
      url: "https://api.spacexdata.com/v3/launches",
    })
      .then((response) => {
        setLaunchesList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(()=>{
    Axios({
      url: "https://api.spacexdata.com/v3/rockets",
    })
      .then((response) => {
        setRocketsList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const results = useMemo(()=>{
    return launchesList.map(launches => {
      return {...launches, rocket: rocketList.find(rocket => rocket.rocket_id === launches.rocket.rocket_id)}
    })
  }
  , [rocketList, launchesList]);

  return <ContainerDashboard>
    <LogoContainer>
      <Logo />
    </LogoContainer>
    <Title>Launches</Title>
    <div>
      <span onClick={()=>{setMenu('All')}}> All </span>
      <span> | </span>
      <span onClick={()=>{setMenu('Fav')}}> Favourites </span>
    </div>
    {menu === 'All' && <LaunchList launches={results} />}
    {menu === 'Fav' && <Favourite />}

  </ContainerDashboard>
}

export default Dashboard;
