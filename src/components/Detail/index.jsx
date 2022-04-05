import { Container } from "@mui/material"
import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

const Details = ()=> {
  let { id } = useParams();

  const [rocket, setRocket] = useState({});

  useEffect(()=>{
    if (id) {
      Axios({
        url: `https://api.spacexdata.com/v3/rockets/${id}`,
      })
        .then((response) => {
          setRocket(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  console.log(rocket)
  return <Container>
    {JSON.stringify(rocket)}
  </Container>
}

export default Details;
