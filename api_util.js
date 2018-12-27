import $k from "./kwery";

const apiKey = "q5189Do1odIYHSAAQAfSO1CokrFV5Tqi4bCCmqgM";

export const getAPOD = () => {
    return $k.ajax({
        method: 'GET',
        url: `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    });
};