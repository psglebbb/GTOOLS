import {defineField, defineType} from 'sanity'

// Singleton document holding the editable Footer / Info content: the DE + EN
// intro texts, the contact email, and any extra contact links. The frontend
// falls back to hardcoded defaults when this doc doesn't exist yet, so the
// site keeps working until it's filled in.
export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Footer / Info',
  type: 'document',
  fields: [
    defineField({
      name: 'deText',
      title: 'Text (Deutsch / DE)',
      type: 'text',
      rows: 8,
      description:
        'Info-Text in der Sprachvariante DE. Leerzeile = Absatz. Der Kontakt-Bereich (E-Mail + Links) wird automatisch darunter angehängt.',
    }),
    defineField({
      name: 'enText',
      title: 'Text (English / EN)',
      type: 'text',
      rows: 8,
      description:
        'Info text for the EN language tab. Blank line = paragraph break. The contact block (email + links) is appended automatically below.',
    }),
    defineField({
      name: 'email',
      title: 'Kontakt E-Mail',
      type: 'string',
      description: 'Wird als anklickbarer mailto:-Link unter dem Text angezeigt.',
    }),
    defineField({
      name: 'contactLinks',
      title: 'Weitere Kontakt-Links',
      type: 'array',
      description: 'Zusätzliche Links (Instagram, Website, …). Erscheinen unter der E-Mail.',
      of: [
        {
          name: 'contactLink',
          title: 'Link',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Beschriftung',
              type: 'string',
              validation: (r: any) => r.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r: any) =>
                r.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
            },
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'studioUrl',
      title: 'Studio-Link (Copyright-Zeile)',
      type: 'url',
      description: 'Ziel des © OGO S.T.U.-Links oben im Footer.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Footer / Info'}),
  },
})
