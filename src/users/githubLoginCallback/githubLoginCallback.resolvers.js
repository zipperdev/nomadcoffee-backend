import axios from "axios";
import jwt from "jsonwebtoken";
import client from "../../client";

const getGithubToken = params => axios({
    method: "POST", 
    url: `https://github.com/login/oauth/access_token?client_id=${params.clientId}&client_secret=${params.clientSecret}&code=${params.code}`, 
    headers: {
        Accept: "application/json"
    }, 
    data: {
        ...params
    }
}).catch(error => error);

const getGithubUserAccount = token => axios.get("https://api.github.com/user", {
    headers: {
        Authorization: `token ${token}`
    }
}).then(data => data.data);

const getGithubEmailObj = token => axios.get("https://api.github.com/user/emails", {
    headers: {
        Authorization: `token ${token}`
    }
}).then(data => data.data).then(data => data.find((email) => email.primary === true && email.verified === true));

const getGithubUser = async params => {
    const { data: { access_token } } = await getGithubToken(params);
    const githubUser = await getGithubUserAccount(access_token);
    return { ...githubUser, githubToken: access_token };
};

export default {
    Mutation: {
        githubLoginCallback: async (_, { code }) => {
            try {
                const githubUser = await getGithubUser({
                    clientId: process.env.GITHUB_LOGIN_ID, 
                    clientSecret: process.env.GITHUB_LOGIN_SECRET, 
                    code
                });
                const emailObj = await getGithubEmailObj(githubUser.githubToken);
                
                const existGithubUser = await client.user.findFirst({
                    where: {
                        socialId: githubUser.clientId
                    }, 
                    select: {
                        id: true, 
                        loginType: true, 
                        email: true
                    }
                });
                const existUser = await client.user.findFirst({
                    where: {
                        email: emailObj.email, 
                        loginType: "normal"
                    }, 
                    select: {
                        id: true, 
                        loginType: true, 
                        email: true
                    }
                });
                let createdUser = null;
                if (existUser) {
                    return {
                        success: false, 
                        error: "Please take another way to log in. The user is not logged in with github."
                    };
                } else if (!existGithubUser) {
                    createdUser = await client.user.create({
                        data: {
                            username: `${githubUser.login}${Math.floor(Math.random() * 100) + parseInt(`${Math.ceil(Math.random() * 9)}` + "00")}`, 
                            email: emailObj.email, 
                            name: githubUser.name, 
                            password: "none", 
                            location: githubUser.location, 
                            avatarURL: githubUser.avatar_url, 
                            githubUsername: githubUser.login, 
                            socialId: githubUser.id, 
                            loginType: "github"
                        }
                    });
                };
                const token = jwt.sign({ id: createdUser ? createdUser.id : existGithubUser.id }, process.env.JWT_SECRET);
                return {
                    success: true, 
                    token
                };
            } catch {
                return {
                    success: false, 
                    error: "Cannot log in with Github."
                };
            };
        }
    }
};