import { gql } from 'apollo-server-express'

const typeDefs = gql`

    scalar Date

    type Query {
        "Get family Object with all needed subfields"
        getFamily: Family,
        getUser: User,
        getEventItem(_id: ID!): EventItem,
        getEventParticipants(_id: ID!): EventItem,
        getWeather(_id: ID!): EventItem,
        getCoordinates(_id: ID!): EventItem,
        getEventComments(_id: ID!): EventItem,
        getEventComment(_id: ID!): Comment,
        checkCommentOwner(_id: ID!): Boolean
    }

    type Mutation {
        signUp(
            username: String!,
            email: String!, 
            password: String!,
            userHash: String!,
            avatarUrl: String!
        ): String
        signIn(email: String!, password: String!): String
        createFamily(familyName: String!, familyAvatarUrl: String!): String
        invite(_id: ID, email: String!): String
        lostPassword(email: String!): String
        resetPassword(password: String!, userHash: String!): String
        updateFamily(_id: ID, familyName: String, familyAvatarUrl: String): Family
        updateUser(username: String, avatarUrl: String): User
        selectBg(selectedBgValue: String, selectedBgLabel: String): String
        createEventItem(
            familyID: ID!,
            activityName: String!,
            activityImageUrl: String!,
            activityDate: Date!,
            activityAddress: String,
            activityDescription: String,
            activityLocation: String!,
            activityUrl: String
        ): String
        setCoordinates(_id: ID, activityCoordinates: String, activityApiCityNotFound: Boolean): String
        setWeather(
            _id: ID, 
            activityApiLastCall: Date,  
            activityWeatherIcon: String,
            activityWeatherTemp: String,
            activityWeatherDesc: String,
            activityWeatherSunrise: String,
            activityWeatherSunset: String,
            activityWeatherWind: String
        ): String
        removeParticipant(_id: ID!): String
        addParticipant(_id: ID!): String
        checkUserParticipant(_id: ID!): Boolean
        updateEventItem(
            _id: ID!,
            activityImageUrl: String,
            activityName: String,
            activityDescription: String,
            activityDate: Date,
            activityLocation: String,
            activityAddress: String,
            activityUrl: String,
        ): String
        removeEventItem(eventItemHash: String!, familyHash: String!): Family
        createEventComment(
            _id: ID!,
            commentText: String!
        ): String
        removeEventComment(commentId: ID!, _id: ID!): String
        removeNotifications(eventId: ID!): String
    }

    type Subscription {
        familyChanged(_id: ID!): Family,
        eventItemCreated(_id: ID!): Family,
        eventItemChanged(_id: ID!): EventItem,
        eventParticipantsChanged(_id: ID!): EventItem,
        weatherChanged(_id: ID!): EventItem,
        coordinatesChanged(_id: ID!): EventItem,
        eventCommentsChanged(_id: ID!): EventItem,
    }

    "Family is the main object"
    type Family {
        _id: ID
        familyName: String
        familyAvatarUrl: String
        familyMembers: [User]
        eventList: [EventItem]
        collectionList: [CollectionList]
    }

    "One user"
    type User {
        _id: ID
        userEmail: String
        userName: String
        password: String
        hash: String
        active: Boolean
        avatarUrl: String
        selectedBgValue: String
        selectedBgLabel: String
    }

    "An event item"
    type EventItem {
        _id: ID
        hash: String
        activityName: String
        activityImageUrl: String
        activityDate: Date
        activityOwner: String
        activityDescription: String
        activityLocation: String
        activityCoordinates: String
        activityApiCityNotFound: Boolean
        activityApiLastCall: Date
        activityWeatherIcon: String
        activityWeatherTemp: String
        activityWeatherDesc: String
        activityWeatherSunrise: String
        activityWeatherSunset: String
        activityWeatherWind: String
        activityAddress: String
        activityUrl: String
        activityImageList: ActivityImageList
        userJoined: Boolean
        updated: Boolean
        newComment: Boolean
        activityParticipantsList: [User]
        comments: [Comment]
        activityUpdateUsers: [User]
        activityNewCommentUsers: [User]
    }

    "Event images list"
    type ActivityImageList {
        activityImageUrl: [String]
    }

    "List containing all collections"
    type CollectionList {
        collectionName: String
        collectionIconUrl: String
        tasks: [TaskItem]
    }

    "Task item"
    type TaskItem {
        _id: ID
        taskName: String
        taskPriorities: [String]
        taspPriority: String
        taskDescription: String
        taskDue: Date
        taskCreated: Date
        taskOwner: String!
        taskResponsibles: [String]
        taskKanbanList: [String]
        taskKanban: String
        taskImageUrl: String
        taskUrl: String
        taskImageList: TaskImageList
        comments: [Comment]
    }

    "Task image list"
    type TaskImageList {
        taskImageUrl: [String]
    }

    "Comment can be used in Events and Tasks"
    type Comment {
        _id: ID
        commentText: String
        commentOwner: User
        createdAt: Date
    }
`

export default typeDefs