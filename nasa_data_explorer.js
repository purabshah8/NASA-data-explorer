import $k from './kwery';
import * as APIUtil from './api_util';
import flatpickr from 'flatpickr';

$k( () => {
    flatpickr('#flatpickr', {
        mode: "range",
        defaultDate: 'today',
    });
    let searchNEOCallback = e => {
        e.preventDefault();
        const fp = $k('#flatpickr');
        const dates = fp.nodes[0].value.split(" to ");
        fetchAllNEOs(dates[0], dates[1]);
    };

    let searchExoCallback = e => {
        e.preventDefault();
        const $distanceInput = $k('#exo-distance');
        const distance = $distanceInput.nodes[0].value;
        fetchExoplanets(distance);
    };
    APIUtil.getAPOD().then(res => {
        const apodURL = res.hdurl;
        const $apod = $k('#apod-container');
        $apod.empty();
        $apod.append(`<img src="${apodURL}" class="apod"/>`);
    });
    const $searchNEO = $k('#neo-button');
    $searchNEO.on('click', searchNEOCallback);
    const $searchExo = $k('#exo-button');
    $searchExo.on('click', searchExoCallback);
});

const fetchAllNEOs = (startDate, endDate) => {
    if (!endDate) {
        endDate = startDate;
    }
    const $neoTable = $k('.neo-table');
    $neoTable.empty();
    $neoTable.append(`<thead><tr class="data-row"> 
                        <th>Name</th>
                        <th>Date</th>
                        <th>Closest Approach</th>
                        <th>Velocity</th>
                        <th>Diameter (est.)</th>
                        <th>Potentially Hazardous?</th>
                    </tr></thead>`);
    const startDateArray = startDate.split('-');
    const endDateArray = endDate.split('-');
    const start = new Date(startDateArray[0], startDateArray[1]-1, startDateArray[2]);
    const end = new Date(endDateArray[0], endDateArray[1]-1, endDateArray[2]);
    if ((end-start)/86400000 > 7) {
        let begin = new Date(start);
        let mid = new Date(start);
        mid.setDate(mid.getDate() + 7);
        while ((end-begin)/86400000 > 7) {
            fetchNEOs(dateToString(begin), dateToString(mid));
            begin = new Date(mid.valueOf());
            begin.setDate(begin.getDate() + 1);
            mid.setDate(mid.getDate() + 7);
        }
        fetchNEOs(dateToString(mid), endDate);
    } else {
        fetchNEOs(startDate, endDate);
    }
};

function fetchNEOs(startDate, endDate) {
    APIUtil.getNEO(startDate, endDate).then(res => {
        const dates = Object.values(res.near_earth_objects);
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
                const $neoTable = $k('.neo-table');
                $neoTable.append(`<tr class="data-row">
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
}

function fetchExoplanets(distance) {
    const $exoTable = $k('.exo-table');
    $exoTable.empty();
    $exoTable.append(`
        <tr class="data-row">
            <th>Planet Name</th>
            <th>Discovery Method</th>
            <th>Distance</th>
            <th>Estimated Mass</th>
            <th>Orbital Period (days)</th>
            <th>Star</th>
        </tr>
    `);

    APIUtil.getExoplanets(distance).then(exoplanets => {
        exoplanets.forEach(planet => {
            const mass = planet.pl_bmassj * 318.02345;
            $exoTable.append(`
                <tr class="data-row">
                    <td>${planet.pl_name}</td>
                    <td>${planet.pl_discmethod}</td>
                    <td>${planet.st_dist.toFixed(2)} pc</td>
                    <td>${(Math.round(mass*1000)/1000).toFixed(3)} Earths</td>
                    <td>${(Math.round(planet.pl_orbper*1000)/1000).toFixed(1)}</td>
                    <td>${planet.pl_hostname}</td>
                </tr>
            `);
        });
    });
}

function dateToString(date) {
    return date.toJSON().split('T')[0];
}

function addCommas(num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}