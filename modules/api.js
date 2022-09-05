import { API, Auth } from "aws-amplify";
import aws_exports from "../src/aws-exports";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import axios from "axios";
import aws4Interceptor from "./aws4interceptor";

const apiName = "demoapi";
const baseURL = "https://vh1ds00pvd.execute-api.us-east-1.amazonaws.com/prod";
const userPoolId = aws_exports.aws_user_pools_id;
const region = aws_exports.aws_project_region;

async function getCredentialsForIdentityPool() {
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html
    const credentialsProvider = fromCognitoIdentityPool({
        identityPoolId: "us-east-1:a60e3bb3-dbad-445d-9e8f-d19982453f62",
        logins: {
            [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: (
                await Auth.currentSession()
            )
                .getIdToken()
                .getJwtToken(),
        },
        clientConfig: { region },
    });
    const credentials = await credentialsProvider();
    console.log(credentials);
    const interceptor = aws4Interceptor(
        {
            region,
            service: "execute-api",
        },
        credentials
    );
    axios.interceptors.request.use(interceptor);
}

export async function getData(path, useIam = true) {
    if (useIam) {
        await getCredentialsForIdentityPool();
        const response = await axios.get(`${baseURL}/${path}`);
        return response.data;
    }

    const myInit = {
        headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
                .getIdToken()
                .getJwtToken()}`,
        },
    };

    return API.get(apiName, path, myInit);
}

export async function postData(path, body, useIam = false) {
    if (useIam) {
        await getCredentialsForIdentityPool();
        const response = await axios.post(`${baseURL}/${path}`, body);
        return response.data;
    }

    const myInit = {
        headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
                .getIdToken()
                .getJwtToken()}`,
        },
        body,
    };

    return API.post(apiName, path, myInit);
}