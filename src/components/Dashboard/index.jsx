import Axios from "axios";
import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";

import { ReactComponent as Logo} from '../../assets/Logo.svg';
import Favourite from "../Favourite";
import LaunchList from "../Common/LaunchList";
import { Pagination, Stack } from "@mui/material";

const ContainerDashboard = styled.div`
  background-color: #121212;
  height: fill-available;
  color: white;
  min-height: 100vh;
  font-family: 'D-DIN';
  font-style: normal;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 39px;
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
`;

const MenuContainer = styled.div`
  background: linear-gradient(180deg, #121212 64.11%, #1E1E1E 100%);
  padding-left: 60px;
`;

const TabsContainer = styled.div`
  display: flex;
  padding-top: 20px;
`;

const Tabs = styled.div`
  width: 180px;
  text-align: center;
  padding-bottom: 5px;
  color: rgba(255, 255, 255, 0.57);
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
    }).sort((a, b) => (a.launch_date_unix < b.launch_date_unix) ? 1 : -1)
  }
  , [rocketList, launchesList]);

  return <ContainerDashboard>
    <MenuContainer>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <div>
        <Title>Launches</Title>
        <TabsContainer >
          <Tabs 
            onClick={()=>{setMenu('All')}}
            style={{ borderBottom: menu === 'All' ? '1px solid white' : '', color: menu === 'All' ? 'white' : '' }}
          >
            All
          </Tabs>
          <Tabs
           onClick={()=>{setMenu('Fav')}}
           style={{ borderBottom: menu === 'Fav' ? '1px solid white' : '', color: menu === 'Fav' ? 'white' : ''}}
          >
           Favourites
          </Tabs>
        </TabsContainer>
      </div>
    </MenuContainer>
    {menu === 'All' && <LaunchList launches={results} />}
    {menu === 'Fav' && <Favourite launches={results} />}
  </ContainerDashboard>
}

export default Dashboard;
