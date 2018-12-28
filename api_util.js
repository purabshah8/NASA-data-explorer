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