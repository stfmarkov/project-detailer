import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IProject extends Document<ObjectId> {
    _id: ObjectId
    userId: string
    title: string
    category: string
    createdAt: Date
    updatedAt: Date
}

export interface IProjectListItem {
    _id: string
    title: string
    category: string
}

const ProjectSchema = new Schema<IProject>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true
  }
)

// Prevent model recompilation in dev mode
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)