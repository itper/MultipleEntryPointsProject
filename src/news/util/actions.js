// import Native from "./getNative";

export function asyncRequestDetail(param)
{
    //和app交互，获取相关数据    
    var deviceInfo = {
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

    // var location = {
    //     'id' : '0',
    //     'latitude' : '',
    //     'longitude' : ''
    // };
    // param.location = location.id;
    // param.coordinate = location.latitude ? location.latitude + ',' + location.longitude : '';

    // var cityInfo = {
    //     'city_id' : ''
    // };
    // param.city_id = cityInfo.city_id;

    // var userInfo = {
    //     'user_id' : '0'
    // };
    // param.user_id = userInfo.user_id;

    // var baseUrl;
    // switch (deviceInfo.env) {
    //     case 'test1' :
    //         baseUrl = 'http://mobds.ganjistatic3.com/api/v1/msc/v1/common/information/v2/detail';
    //         break;
    //     case 'web6' :
    //         baseUrl = 'http://mobtestweb6.ganji.com/api/v1/msc/v1/common/information/v2/detail';
    //         break;
    //     default:
    //         baseUrl = 'http://mobds.ganji.cn/api/v1/msc/v1/common/information/v2/detail';
    // }
    return new Promise(function (resolve , reject) {
        fetch('http://mobds.ganji.cn/api/v1/msc/v1/common/news/v2/detail?newsid=HOU2016091219416520&tabid=recomm&location=0&coordinate=&city_id=undefined&user_id=0&isnew=true&_rand=0.46927581206818636',{
            method : 'get',
            headers : {
                'Content-Type':'application/json',
                'X-Ganji-CustomerId':deviceInfo.customerId,
                'X-Ganji-VersionId':deviceInfo.versionId,
                'X-Ganji-InstallId':deviceInfo.userId,
                'X-Ganji-ClientAgent':deviceInfo.clientAgent,
                'X-Ganji-Agency':deviceInfo.agency,
                'X-Ganji-token':deviceInfo.token,
                'interface':'InformationList'
            },
            dataType: 'json'
        }).then(function(response){
            return response.json();
        }).then(function(data) {

            if(data.errorno === 0)
            {

                resolve(data.data);
            }
            else
            {

                reject(data);
            }
        });
    });
}

// function dealParam(json){
//     var param = [];
//     for( var o in json) {
//         param.push(o + '=' + json[o]);
//     }
//     return param.join('&');
// }