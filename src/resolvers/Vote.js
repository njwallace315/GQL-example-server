const user = ({ id }, args, context) => context.prisma.vote({ id }).user()
const link = ({ id }, args, context) => context.prisma.vote({ id }).link()


module.exports = {
    link,
    user,
}