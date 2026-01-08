import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface IConversation extends Document<ObjectId> {
    _id: ObjectId
    projectId: string
    title: string
    messages: IMessage[]
    conversationId: string
    createdAt: Date
    updatedAt: Date
}

export interface IConversationListItem {
    _id: string
    conversationId: string
    title: string
    createdAt: Date
}

const ConversationSchema = new Schema<IConversation>({
    projectId: {
        type: String,
        required: true,
        index: true
    },
    conversationId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    messages: {
        type: [{ role: String, content: String }],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Prevent model recompilation in dev mode
export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)

