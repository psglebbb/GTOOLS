import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zgw7guo3',
    dataset: 'production'
  },
  studioHost: 'gtools-archiv',
  deployment: {
    appId: 'gbphbtve8wykab5ctalyfqpg',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
