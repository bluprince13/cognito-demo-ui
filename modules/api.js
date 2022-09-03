import { API, Auth } from "aws-amplify";

const apiName = "demoapi";

export async function getData(path) {
    const myInit = {
        headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
                .getIdToken()
                .getJwtToken()}`,
        },
    };

    return API.get(apiName, path, myInit);
}


export async function postData(path, body) {
    const myInit = {
        headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
                .getIdToken()
                .getJwtToken()}`,
        },
        body
    };

    return API.post(apiName, path, myInit);
}
