import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface ITask extends Document<ObjectId> {
    _id: ObjectId
    projectId: string
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
    createdAt: Date
    updatedAt: Date
}

const TaskSchema = new Schema<ITask>({
    projectId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
})

// Prevent model recompilation in dev mode
export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)

