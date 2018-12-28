import $k from './kwery';
import * as APIUtil from './api_util';

$k( () => {
    console.log('loaded!');
    APIUtil.getAPOD().then(res => {
        const apodURL = res.hdurl;
        const $apod = $k('#apod-container');
        $apod.append(`<img src="${apodURL}" class="apod"/>`);
    });
    APIUtil.getNEO('2018-12-26', '2018-12-27').then(res => {
        const count = res.element_count;
        const $neoList = $k('.neo-table');
        const dates = Object.values(res.near_earth_objects);
        console.log(count, dates);
        dates.forEach(date => {
            date.forEach(neo => {
                const closeApproachData = neo.close_approach_data[0];
                const maxDiameter = neo.estimated_diameter.kilometers.estimated_diameter_max;
                const minDiameter = neo.estimated_diameter.kilometers.estimated_diameter_min;
                const midDiameter = (maxDiameter+minDiameter)/2;
                const errorRange = (maxDiameter-minDiameter)/2;
                const estDiameter = `${Math.round(midDiameter*1000)/1000}    &plusmn; ${Math.round(errorRange*1000)/1000}`;
                const closestApproach = closeApproachData.miss_distance.astronomical;
                const velocity = closeApproachData.relative_velocity.kilometers_per_second;
                const hazardous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
                $neoList.append(`<tr class="neo-row">
                                    <td>${neo.name}</td>
                                    <td>${closeApproachData.close_approach_date}</td>
                                    <td>${Math.round(closestApproach*1000)/1000} AU</td>
                                    <td>${Math.round(velocity*1000)/1000} km/s</td>
                                    <td>${estDiameter} km</td>
                                    <td>${hazardous}</td>
                                </tr>`);
            });
        });
    });
});