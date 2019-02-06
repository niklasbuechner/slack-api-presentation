const axios = require('axios');

async function getAvailableLabels(repo) {
    const query = `query ($repositoryOwner: String!, $repositoryName: String!) { 
    repository(owner: $repositoryOwner, name: $repositoryName) {
        labels(first: 20) {
            nodes {
                id,
                name,
            }
        }
    }
}`;

    const [owner, name] = repo.split('/');
    const response = await axios.post(
        'https://api.github.com/graphql',
        {
            query,
            variables: {
                repositoryOwner: owner,
                repositoryName: name,
            }
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' token ' + process.env.GITHUB_TOKEN,
            },
        }
    );

    return response.data.data.repository.labels.nodes;
}

async function addLabel(repo, number, label) {
    return axios.post(
        'https://api.github.com/repos/' + repo + '/issues/' + number + '/labels',
        {
            labels: [label],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' token ' + process.env.GITHUB_TOKEN,
                'User-Agent': 'pickware-io',
            },
        }
    );
}

async function removeLabel(repo, number, label) {
    return axios.delete(
        'https://api.github.com/repos/' + repo + '/issues/' + number + '/labels/' + label,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' token ' + process.env.GITHUB_TOKEN,
            },
        }
    )
}

module.exports = {
    getAvailableLabels,
    addLabel,
    removeLabel,
};