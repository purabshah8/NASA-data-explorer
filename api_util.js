import $k from "./kwery";

const api_key = "q5189Do1odIYHSAAQAfSO1CokrFV5Tqi4bCCmqgM";

export const getAPOD = () => {
    return $k.ajax({
        method: 'GET',
        url: 'https://api.nasa.gov/planetary/apod',
        data: {
            api_key,
        },
    });
};

export const getNEO = (start_date, end_date) => {
    if (!end_date) {
        end_date = start_date;
    }
    return $k.ajax({
        method: 'GET',
        url: 'https://api.nasa.gov/neo/rest/v1/feed',
        data: {
            start_date,
            end_date,
            api_key,
        }
    });
};

export const getExoplanets = (dist) => {
    return $k.ajax({
        method: 'GET',
        url: `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&where=st_dist%3C${dist}&format=json`
    });
};