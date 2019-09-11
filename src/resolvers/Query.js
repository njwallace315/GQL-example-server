const feed = async (root, { filter, skip, first, last, orderBy }, context, info) => {
    const where = filter ? (
        {
            OR: [
                { description_contains: filter },
                { url_contains: filter }
            ]
        }
    ) : {}
    const links = await context.prisma.links({ where, skip, first, last, orderBy })
    const count = await context.prisma
        .linksConnection({
            where,
        })
        .aggregate()
        .count()
    return {
        links,
        count,
    }
};

const info = () => "Sample GQL server setup from guide at howtographql.com"
module.exports = {
    feed,
    info
}