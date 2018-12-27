import $k from './kwery';
import * as APIUtil from './api_util';

$k( () => {
    console.log('loaded!');
    APIUtil.getAPOD().then(res => {
        const apodURL = res.hdurl;
        const $apod = $k('#apod-container');
        $apod.append(`<img src="${apodURL}" class="apod"/>`);
    });
    
});