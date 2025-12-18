import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IContext extends Document<ObjectId> {
  _id: ObjectId
  projectId: string
  title: string
  content: string
  embedding: number[]
  createdAt: Date
  updatedAt: Date
}

const ContextSchema = new Schema<IContext>(
  {
    projectId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number],
      required: true,
      // voyage-2 produces 1024-dimensional vectors
    }
  },
  {
    timestamps: true
  }
)

// Prevent model recompilation in dev mode
export const Context = mongoose.models.Context || mongoose.model<IContext>('Context', ContextSchema)

