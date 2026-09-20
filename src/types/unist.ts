import type { Node } from "unist-builder"

export interface UnistNode extends Node {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: {
    [key: string]: unknown
  }
  children?: UnistNode[]
}

export interface UnistTree extends Node {
  children: UnistNode[]
}
