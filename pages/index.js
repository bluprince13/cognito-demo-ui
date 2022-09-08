import { Amplify } from "aws-amplify";
import React from "react";
import { useState, useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { signOut, getUser } from "../modules/auth";
import { getData, postData } from "../modules/api";
import awsconfig from "../src/aws-exports";

Amplify.configure({
    ...awsconfig,
    API: {
        endpoints: [
            {
                name: "demoapi",
                endpoint:
                    "https://vh1ds00pvd.execute-api.us-east-1.amazonaws.com/prod/",
            },
        ],
    },
});



function Home() {
    const [user, setUser] = useState({ email: "", groups: [] });
    const [output, setOutput] = useState("");

    useEffect(() => {
        getUser().then((user) => setUser(user));
    }, []);

    const clickButton = async ({
        path,
        body = "",
        method = "get",
        auth = "",
    }) => {
        let newOutput;
        newOutput = `Request: ${path}\n`;
        try {
            const response =
                method == "get"
                    ? await getData(path, auth)
                    : await postData(path, body, auth);
            newOutput += `Response: ${response}`;
            console.log(response);
        } catch (error) {
            console.error(error);
            newOutput += `Error: ${JSON.stringify(error.response.data)}`;
        }
        newOutput += "\n";
        newOutput += "------------\n";
        setOutput(newOutput + output);
    };

    return (
        <div>
            <h1>Cognito Demo UI</h1>
            <div>
                Logged in user is {user.email}. They are in groups:{" "}
                {user.groups.join(", ")}.
            </div>
            <br></br>
            <button
                onClick={() =>
                    clickButton({
                        path: "",
                    })
                }
            >
                Public API
            </button>

            <button
                onClick={() =>
                    clickButton({
                        path: "user-pool-based",
                        auth: "JWT",
                    })
                }
            >
                User pool based API
            </button>

            <button
                onClick={() =>
                    clickButton({
                        path: "user-group-based",
                        auth: "IAM",
                    })
                }
            >
                User pool group - reader API
            </button>

            <button
                onClick={async () =>
                    await clickButton({
                        path: "user-group-based",
                        body: "some body",
                        method: "post",
                        auth: "IAM",
                    })
                }
            >
                User pool group - writer API
            </button>

            <button onClick={signOut}>Sign out</button>

            <h2>Output</h2>
            <div>
                {output.split("\n").map((i, key) => {
                    return <div key={key}>{i}</div>;
                })}
            </div>
        </div>
    );
}

export default withAuthenticator(Home);
