import { defineAction, z } from 'astro:actions'
import { getBestMoveIndex } from '../utils/ai'

export const server = {
  ai: defineAction({
    input: z.object({
      board: z.array(z.union([z.literal('X'), z.literal('O'), z.literal('')])),
    }),
    handler: async ({ board }) => {
      return { index: getBestMoveIndex(board) }
    },
  }),
}
