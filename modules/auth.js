import { Auth } from "aws-amplify";

export async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log("error signing out: ", error);
    }
}

export async function getUser() {
    const user = await Auth.currentAuthenticatedUser();
    const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
    const email = user.attributes.email;
    return { groups, email };
}
