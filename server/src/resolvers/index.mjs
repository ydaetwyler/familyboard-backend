import Family from '../models/family.mjs'
import FamilyMemberList from '../models/familyMemberList.mjs'
import User from '../models/user.mjs'
import EventItem from '../models/eventItem.mjs'
import AvatarList from '../models/avatarList.mjs'
import ActivityImageList from '../models/activityImageList.mjs'
import CollectionList from '../models/collectionList.mjs'
import TaskItem from '../models/taskItem.mjs'
import TaskImageList from '../models/taskImageList.mjs'
import Comment from '../models/comment.mjs'

import getOne from './services/getOne.mjs'
import getAll from './services/getAll.mjs'

import {
    createFamily,
    createUser,
    createEventItem,
    createCollection,
    createTaskItem,
    createComment,
} from './services/create.mjs'
// import update from './services/update.mjs'
// import remove from './services/remove.mjs'

import signUp from './services/signup.mjs'
import signIn from './services/signin.mjs'

// Family
export const allFamilies = () => getAll(Family)

export const family = id => getOne(id, Family)

export const newFamily = args => createFamily(args, Family)

// FamilyMemberList
export const familyMemberList = id => getOne(id, FamilyMemberList)

// User
export const allUsers = () => getAll(User)

export const user = id => getOne(id, User)

export const newUser = args => signUp(args, User)

export const loginUser = args => signIn(args, User)

// AvatarList
export const avatarList = id => getOne(id, AvatarList)

// Event Item
export const allEventItems = () => getAll(EventItem)

export const eventItem = id => getOne(id, EventItem)

export const newEventItem = args => createEventItem(args, EventItem)

// AvatarList
export const activityImageList = id => getOne(id, ActivityImageList)

// Collections
export const allCollections = () => getAll(CollectionList)

export const collection = id => getOne(id, CollectionList)

export const newCollection = args => createCollection(args, CollectionList)

// Task Item
export const allTaskItems = () => getAll(TaskItem)

export const taskItem = id => getOne(id, TaskItem)

export const newTaskItem = args => createTaskItem(args, TaskItem)

// TaskImageList
export const taskImageList = id => getOne(id, TaskImageList)

// Comment
export const comment = id => getOne(id, Comment)

export const newComment = args => createComment(args, Comment)

