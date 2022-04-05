import LaunchList from "../Common/LaunchList";
import { useMemo } from "react";

const Favourite = ({launches}) => {
  const filtered = useMemo(() => {
    let data = sessionStorage.getItem('favourite')?.split(',') || [];
    return launches.filter( launch => data.some(elem => elem === launch.flight_number.toString()));
  }, [launches]);
  
  return <div>
    <LaunchList launches={filtered}/>
  </div>
}

export default Favourite;