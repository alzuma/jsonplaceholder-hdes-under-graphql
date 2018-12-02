import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql';

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: '...',
    fields: () => ({
        id: {type: GraphQLInt},
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        postOwner: {
            type: UserType,
            resolve: (obj, args, {loaders}) => loaders.user.load(`/users/${obj.userId}/`)
        }
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    description: '...',
    fields: () => ({
        name: {type: GraphQLString},
        catchPhrase: {type: GraphQLString},
        bs: {type: GraphQLString},
    })
});

const GeoType = new GraphQLObjectType({
    name: 'Geo',
    description: '...',
    fields: () => ({
        lat: {type: GraphQLString},
        lng: {type: GraphQLString},
    })
});

const AddressType = new GraphQLObjectType({
    name: 'Address',
    description: '...',
    fields: () => ({
        street: {type: GraphQLString},
        suite: {type: GraphQLString},
        city: {type: GraphQLString},
        zipcode: {type: GraphQLString},
        geo: {type: GeoType}
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    description: '...',

    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        address: {type: AddressType},
        phone: {type: GraphQLString},
        website: {type: GraphQLString},
        company: {type: CompanyType},
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
        user: {
            type: UserType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (root, args, {loaders}) => loaders.user.load(`/users/${args.id}/`)
        },
        allUser: {
            type: GraphQLList(UserType),
            resolve: (root, args, {loaders}) => loaders.user.allUsers()
        },
        post: {
            type: PostType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (root, args, {loaders}) => loaders.user.load(`/posts/${args.id}/`)
        },
        allPost: {
            type: GraphQLList(PostType),
            resolve: (root, args, {loaders}) => loaders.post.allUsers()
        },
    })
});

export default new GraphQLSchema({
    query: QueryType
})