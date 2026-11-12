import path from 'path'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Resolved from the process cwd so it maps to the /app/media volume in Docker.
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
  },
}
