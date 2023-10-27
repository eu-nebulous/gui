import { IResource } from "@/interfaces/resources.interface.ts"

export type IResourcePayload = Omit<IResource, "uuid" | "enabled">
