const { GraphQLServer } = require('graphql-yoga');

let links = [{ id: "link-0", url: 'www.howtographql.com', description: "Fullstack tutorial for GraphQL" }]
let idCount = links.length;
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
    },
    Mutation: {
        post: (parent, { url, description }) => {
            const link = {
                id: `link-${idCount++}`,
                url,
                description,
            }
            links.push(link)
            return link;
        },
        updateLink: (parent, { id, description, url }) => {
            let link;
            links = links.map(x => {
                if (x.id === id) {
                    link = { id, url: url || x.url, description: description || x.description }
                    return link
                }
                return x
            })
            return link
        },
        deleteLink: (parent, { id }) => {
            let link;
            links = links.filter(x => {
                if (x.id === id) {
                    link = { ...x };
                    return false;
                }
                return true
            });
            return link
        }

    },

    /* This is implicit */
    // Link: {
    //     id: ({ id }) => id,
    //     url: ({ url }) => url,
    //     description: ({ description }) => description,
    // }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
})
server.start(() => { console.log('GraphQL server is running on http://localhost:4000') })