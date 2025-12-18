import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IProject extends Document<ObjectId> {
    _id: ObjectId
    title: string
    category: string
    createdAt: Date
    updatedAt: Date
}

const ProjectSchema = new Schema<IProject>({
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