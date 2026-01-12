import { Task } from "../models/Task"
import { connectToMongoDB } from "../utils/mongodb"

export default async (projectId: string, userId: string) => {
    await connectToMongoDB()

    const tasks = await Task.find({ projectId, userId })
        .sort({ createdAt: -1 })
        .lean()

    return tasks
}