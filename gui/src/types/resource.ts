import {INodeCandidate, IResource} from "@/interfaces/resources.interface.ts"

export type IResourcePayload = Omit<IResource, "uuid" | "enabled">
export type ICandidatesPayload = Omit<INodeCandidate, "uuid" | "enabled">
