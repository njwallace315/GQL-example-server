const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

const login = async (parent, args, context, info) => {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

const post = (parent, args, context, info) => {
    const userId = getUserId(context)
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
    })
}

const vote = async (parent, { linkId }, context, info) => {
    const userId = getUserId(context)

    const voteExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: linkId }
    })
    if (voteExists) throw new Error(`User ${userId} already voted for link ${linkId}`)
    return context.prisma.createVote({
        /**
         * connect here seems to be replacing 
         *      user: context.users.findOne(id: userId)
         * "If exists returns false, the createVote method will be used to create a new Vote that’s connected to the User and the Link."
         */
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } }
    })
}

module.exports = {
    signup,
    login,
    post,
    vote,
}