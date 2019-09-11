const postedBy = ({ id }, arge, context) => context.prisma.link({ id }).postedBy();

const votes = ({ id }, args, context) => context.prisma.link({ id }).votes();

module.exports = {
    postedBy,
    votes,
}

/**
 * You'll notice that we are accessing the link collection (or so it would seem) from prisma to find some fields but not others
 * We search the db for connected fields that are in other collections (postedBy looks in the users collection and votes in the votes collection)
 * the parent already contains the other fields that are described in the link model
 */