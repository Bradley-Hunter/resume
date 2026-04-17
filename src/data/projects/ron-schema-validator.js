const exampleSchema = `// recipe.ronschema
// Validates recipe data files

(
  title: String,
  servings: Integer,
  prep_time: Float,
  vegetarian: Bool,
  source: Option(String),
  ingredients: [Ingredient],
  tags: [String],
  nutrition: {String: Integer},
  difficulty: Difficulty,
)

type Ingredient = (
  name: String,
  quantity: Float,
  unit: Unit,
)

enum Difficulty { Easy, Medium, Hard }
enum Unit { Cup, Tbsp, Tsp, Oz, Gram, Whole }`

export default {
  slug: 'ron-schema-validator',
  title: 'ron-schema-validator',
  order: 1,
  featured: true,
  date: 'Apr 2026',
  description:
    'An open-source project I started to bring schema validation to RON (Rusty Object Notation) files. RON has no equivalent of JSON Schema — this project fills that gap. Define the expected structure of your .ron data in a custom .ronschema format that mirrors the shape of the data it validates, then validate against it — catching type mismatches, missing fields, invalid enum variants, and more. Includes a zero-dependency library crate and a CLI that supports batch validation and JSON output.',
  tools: ['Rust', 'Clap'],
  github: 'https://github.com/Bradley-Hunter/ron-schema-validator',
  githubNote: 'Open source — MIT licensed.',
  files: [
    {
      name: 'recipe.ronschema',
      language: 'rust',
      code: exampleSchema,
    },
  ],
}
