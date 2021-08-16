export default {
    Query: {
        githubLoginUrl: () => `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_LOGIN_ID}&scope=user`
    }
};