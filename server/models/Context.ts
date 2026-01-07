import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IContext extends Document<ObjectId> {
  _id: ObjectId
  projectId: string
  title: string
  content: string
  embedding: number[]
  fileId?: string      // UUID to group chunks from same file
  fileName?: string    // Original file name
  chunkIndex?: number  // Order of chunk within file
  createdAt: Date
  updatedAt: Date
}

export interface IFile extends Document<ObjectId> {
  fileId: string
  projectId: string
  fileName: string
  chunksCount: number
  createdAt: Date
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
    },
    fileId: {
      type: String,
      required: false,
      index: true
    },
    fileName: {
      type: String,
      required: false
    },
    chunkIndex: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
)

// Prevent model recompilation in dev mode
export const Context = mongoose.models.Context || mongoose.model<IContext>('Context', ContextSchema)

