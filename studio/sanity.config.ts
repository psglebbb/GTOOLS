import {defineConfig} from 'sanity'
import {structureTool, type StructureResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Sidebar: one folder per big category (boxes filtered to that category, and the
// "+" there pre-fills the category), plus the category docs themselves, a flat
// "All Boxes" list, and Authors. New category docs become new folders on reload.
const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({apiVersion: '2021-06-07'})
  const categories: Array<{_id: string; title?: string}> = await client.fetch(
    `*[_type == "category"] | order(order asc){_id, title}`,
  )

  const categoryFolders = categories.map((cat) =>
    S.listItem()
      .id(cat._id)
      .title(cat.title || '(untitled category)')
      .child(
        S.documentList()
          .title(cat.title || 'Boxes')
          .schemaType('tool')
          .filter('_type == "tool" && category._ref == $catId')
          .params({catId: cat._id})
          .initialValueTemplates([
            S.initialValueTemplateItem('tool-by-category', {categoryId: cat._id}),
          ]),
      ),
  )

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Big Categories')
        .child(S.documentTypeList('category').title('Big Categories')),
      S.divider(),
      ...categoryFolders,
      S.divider(),
      S.listItem()
        .title('All Boxes')
        .child(S.documentTypeList('tool').title('All Boxes')),
      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author').title('Authors')),
    ])
}

export default defineConfig({
  name: 'default',
  title: 'Mein Archiv',

  projectId: 'zgw7guo3',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Parameterized template so "+ Box" inside a category folder pre-fills its category.
    templates: (prev) => [
      ...prev,
      {
        id: 'tool-by-category',
        title: 'Box in this category',
        schemaType: 'tool',
        parameters: [{name: 'categoryId', type: 'string'}],
        value: (params: {categoryId: string}) => ({
          category: {_type: 'reference', _ref: params.categoryId},
        }),
      },
    ],
  },
})
