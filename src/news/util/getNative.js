import NativeAPI from "@ganji/native";

export const defaultDeviceInfo = {
    'customerId': '801',
    'clientAgent': 'sdk#320*480',
    'GjData-Version': '1.0',
    'versionId': '6.0.0',
    'model': 'Generic/AnyPhone',
    'agency': 'agencydefaultid',
    'contentformat': 'json2',
    'userId': 'BE83217369A16664CD7828E24D1485A0',
    'token': '625041364b4370596363785434634576625043543561564f',
    'mac': '787987779',
    'os': '',
    'env': 'online'
};

export const defaultLocation = {
    'id' : '0',
    'latitude' : '',
    'longitude' : ''
};

export const defaultCityInfo = {
    'city_id' : ''
};

export const defaultUserInfo = {
    'user_id' : '0'
};

// export function getMessage(msg, param) {
//     return new Promise((resolve, reject) => {
//         if(!isSuppport()) {
//             reject(0);
//         }
//         NativeAPI.invoke(
//             msg,
//             param,
//             function (err, data) {
//                 if(err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }

//             });
//     });
    
// }

export function isSuppport() {
    if(NativeAPI) {
        return NativeAPI.isSuppport();
    } else {
        return false;
    }
}
