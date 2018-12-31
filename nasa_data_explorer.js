import $k from './kwery';
import * as APIUtil from './api_util';
import flatpickr from 'flatpickr';

$k( () => {
    console.log('loaded!');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today = new Date();
    // debugger
    flatpickr('#flatpickr', {
        mode: "range",
        defaultDate: 'today'
    });
    let searchNEOCallback = e => {
        e.preventDefault();
        const fp = $k('#flatpickr');
        const dates = fp.nodes[0].value.split(" to ");
        fetchNEOs(dates[0], dates[1]);
        console.log('hit callback!');
    };
    APIUtil.getAPOD().then(res => {
        const apodURL = res.hdurl;
        const $apod = $k('#apod-container');
        $apod.append(`<img src="${apodURL}" class="apod"/>`);
    });
    // fetchNEOs(dateToString(yesterday), dateToString(today));
    const $searchButton = $k('#neo-search-button');
    $searchButton.on('click', searchNEOCallback);
});

const fetchNEOs = (startDate, endDate) => {
    APIUtil.getNEO(startDate, endDate).then(res => {
        const count = res.element_count;
        const $neoTable = $k('.neo-table');
        $neoTable.empty();
        $neoTable.append(`<thead><tr class="neo-row"> 
                            <th>Name</th>
                            <th>Date</th>
                            <th>Closest Approach</th>
                            <th>Velocity</th>
                            <th>Diameter (est.)</th>
                            <th>Potentially Hazardous?</th>
                        </tr></thead>`);
        const dates = Object.values(res.near_earth_objects);
        console.log(count, dates);
        dates.forEach(date => {
            date.forEach(neo => {
                const closeApproachData = neo.close_approach_data[0];
                const maxDiameter = neo.estimated_diameter.meters.estimated_diameter_max;
                const minDiameter = neo.estimated_diameter.meters.estimated_diameter_min;
                const midDiameter = (maxDiameter+minDiameter)/2;
                const errorRange = (maxDiameter-minDiameter)/2;
                const estDiameter = `${Math.round(midDiameter*1000)/1000} &plusmn; ${Math.round(errorRange*1000)/1000}`;
                let closestApproach = closeApproachData.miss_distance.kilometers;
                closestApproach = addCommas(closestApproach);
                const velocity = closeApproachData.relative_velocity.kilometers_per_second;
                const hazardous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
                $neoTable.append(`<tr class="neo-row">
                                    <td>${neo.name}</td>
                                    <td>${closeApproachData.close_approach_date}</td>
                                    <td>${closestApproach} km</td>
                                    <td>${Math.round(velocity*1000)/1000} km/s</td>
                                    <td>${estDiameter} m</td>
                                    <td>${hazardous}</td>
                                </tr>`);
            });
        });
    });
};

function dateToString(date) {
    return date.toJSON().split('T')[0];
}

function addCommas(num) {
    // debugger
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}