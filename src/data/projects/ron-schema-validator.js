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

const ronValue = `// The data model for parsed RON values. This is the core type
// that the custom parser produces and the validator consumes.
//
// The key variant here is Identifier(String) — it preserves
// bare identifier names like "Creature" or "Sentinels" so
// the validator can check them against known enum variants.
// The standard \`ron\` crate erases these names in its Value
// type, which is why this project needed its own parser.

/// A parsed RON data value, preserving bare identifiers for enum validation.
#[derive(Debug, Clone, PartialEq)]
pub enum RonValue {
    /// A quoted string (e.g., \`"Ashborn Hound"\`).
    String(String),
    /// A whole number (e.g., \`42\`, \`-1\`).
    Integer(i64),
    /// A floating-point number (e.g., \`3.14\`, \`1.0\`).
    Float(f64),
    /// A boolean (\`true\` or \`false\`).
    Bool(bool),
    /// \`Some(value)\` or \`None\`. The inner value carries its own span for precise error reporting.
    Option(Option<Box<Spanned<RonValue>>>),
    /// A bare identifier (e.g., \`Creature\`, \`Sentinels\`). Preserved for enum variant validation.
    Identifier(String),
    /// An enum variant with associated data (e.g., \`Damage(5)\`).
    EnumVariant(String, Box<Spanned<RonValue>>),
    /// A list of values (e.g., \`[Creature, Trap]\`). Each element carries its own span.
    List(Vec<Spanned<RonValue>>),
    /// A map of key-value pairs (e.g., \`{ "str": 5, "dex": 3 }\`).
    Map(Vec<(Spanned<RonValue>, Spanned<RonValue>)>),
    /// A positional tuple (e.g., \`(1.0, 2.5)\`). Each element carries its own span.
    Tuple(Vec<Spanned<RonValue>>),
    /// A struct with named fields (e.g., \`(name: "foo", age: 5)\`).
    Struct(RonStruct),
}

/// A parsed RON struct containing ordered field name-value pairs.
#[derive(Debug, Clone, PartialEq)]
pub struct RonStruct {
    /// Field name-value pairs in declaration order. Both names and values carry spans.
    pub fields: Vec<(Spanned<String>, Spanned<RonValue>)>,
    /// Source location of the closing \`)\`, used as the anchor for missing field errors.
    pub close_span: Span,
}`

const enumValidation = `// This is the validation logic for enum fields, and it is
// the reason the custom parser exists. Because the parser
// preserves bare identifier names as Identifier(String)
// rather than erasing them, the validator can match them
// against the schema's list of known variants.
//
// It handles three cases: bare identifiers for unit variants
// like "Creature", data variants like "Damage(5)", and
// anything else which is a type mismatch.

SchemaType::EnumRef(enum_name) => {
    let enum_def = &enums[enum_name];
    let variant_names: Vec<String> = enum_def.variants.keys().cloned().collect();

    match &actual.value {
        // Bare identifier — check it matches a known unit variant
        RonValue::Identifier(variant) => {
            match enum_def.variants.get(variant) {
                None => {
                    errors.push(ValidationError {
                        path: path.to_string(),
                        span: actual.span,
                        kind: ErrorKind::InvalidEnumVariant {
                            enum_name: enum_name.clone(),
                            variant: variant.clone(),
                            valid: variant_names,
                        },
                    });
                }
                // Variant exists but expects data — bare identifier is wrong
                Some(Some(_expected_data_type)) => {
                    errors.push(ValidationError {
                        path: path.to_string(),
                        span: actual.span,
                        kind: ErrorKind::InvalidVariantData {
                            enum_name: enum_name.clone(),
                            variant: variant.clone(),
                            expected: "data".to_string(),
                            found: "unit variant".to_string(),
                        },
                    });
                }
                Some(None) => {} // Unit variant, matches
            }
        }
        // Enum variant with data — check it matches a known data variant
        RonValue::EnumVariant(variant, data) => {
            match enum_def.variants.get(variant) {
                None => {
                    errors.push(ValidationError {
                        path: path.to_string(),
                        span: actual.span,
                        kind: ErrorKind::InvalidEnumVariant {
                            enum_name: enum_name.clone(),
                            variant: variant.clone(),
                            valid: variant_names,
                        },
                    });
                }
                // Variant exists but is a unit variant — data is unexpected
                Some(None) => {
                    errors.push(ValidationError {
                        path: path.to_string(),
                        span: actual.span,
                        kind: ErrorKind::InvalidVariantData {
                            enum_name: enum_name.clone(),
                            variant: variant.clone(),
                            expected: "unit variant".to_string(),
                            found: describe(&data.value),
                        },
                    });
                }
                // Data variant matches — recurse into the associated data
                Some(Some(expected_data_type)) => {
                    validate_type(
                        expected_data_type, data, path,
                        errors, warnings, enums, aliases,
                    );
                }
            }
        }
        // Not an identifier or enum variant at all — wrong type entirely
        _ => {
            errors.push(ValidationError {
                path: path.to_string(),
                span: actual.span,
                kind: ErrorKind::TypeMismatch {
                    expected: enum_name.clone(),
                    found: describe(&actual.value),
                },
            });
        }
    }
}`

export default {
  slug: 'ron-schema-validator',
  title: 'ron-schema-validator',
  order: 2,
  featured: true,
  date: 'Apr 2026',
  summary: 'A schema validation tool for RON (Rusty Object Notation) files, built as a zero-dependency Rust library and CLI. RON has no equivalent of JSON Schema, so I built one, complete with custom parsers, batch validation, and rustc-style error reporting.',
  description:
    "RON, which stands for Rusty Object Notation, is a data format designed to look and feel like Rust syntax, and it is commonly used for configuration files and game data in the Rust ecosystem. Unlike JSON, which has JSON Schema, RON has no equivalent tooling for defining and validating the expected structure of a data file. I ran into this gap firsthand while working on a card game project where I had over ninety individual `.ron` files representing cards, each one needing to follow the same structure with the same field names, types, and enum variants. Validating those files by hand was not realistic, and there was nothing on crates.io or anywhere else that could do it for me, so I built ron-schema-validator to fill that gap. It is a library crate and CLI tool that lets you define the expected shape of your RON data in a schema file and then validate against it, catching type mismatches, missing fields, invalid enum variants, and anything else that deviates from what the schema says should be there.\n\nThe first design decision was how schemas should actually be written. I could have embedded validation rules inside RON files themselves, or used a completely separate notation, but both of those approaches have the same problem: the schema would not look like the data it validates, which means you would need to mentally translate between two different formats every time you wanted to check whether a field was defined correctly. Instead I created a custom `.ronschema` format that mirrors the shape of RON data while adding type annotations, so if you can read the data file you can read the schema file because they share the same structural layout. The schema format supports the full range of types you would expect, including structs with named fields, enums with or without associated data, lists, maps, tuples, optionals, and type aliases for reusing definitions, and it reads like a Rust type definition, which felt natural given that the data format itself is designed to look like Rust.\n\nBuilding the schema parser was straightforward since the `.ronschema` format was my own design, but parsing the actual RON data files turned out to require building a parser from scratch as well, and the reason for that came down to a fundamental limitation in the existing `ron` crate, which is the standard Rust library for parsing RON. When the `ron` crate parses a RON file, its `Value` type does not preserve bare identifier names. If your data file contains a field like `card_type: Creature`, the crate sees that `Creature` is an identifier but does not keep the name `\"Creature\"` in a way that a validator can check against a list of known enum variants. That means enum validation, which was one of the most important features for my use case since every card had multiple enum fields like card type, faction, and supertype, is fundamentally impossible with the standard library's data model. Because of this limitation I wrote a hand-rolled recursive descent parser that preserves every piece of information the validator would need, including bare identifier names as their own value type and byte-accurate source positions on every single value so that error messages can point to the exact line and column where something went wrong.\n\nThe validator itself was designed around the fact that the primary use case is batch validation, running the tool against a directory of ninety-plus files and getting back every problem at once rather than failing on the first error. If the validator stopped at the first issue, you would fix that one problem, re-run the tool, find the next error, fix that, re-run again, and repeat that cycle dozens of times across dozens of files. Instead the validator walks the entire data structure, collects every error it finds into a list, and reports them all at the end. Each error carries its full field path, like `cost.generic[0]` for the first element of a nested list inside a struct field, along with the exact source span from the parser, which the CLI uses to render errors in the same style as the Rust compiler with line numbers, source context, and caret underlines pointing at exactly where the problem is. The CLI also supports JSON output for tooling integration, so other programs can consume the validation results without parsing human-readable text.\n\nBeyond the core parsing and validation, there are several features that turned this from a parser exercise into a tool I could actually publish and expect other people to use. Field annotations let you add constraints like `@range(1, 10)` for numeric bounds, `@min_length` and `@max_length` for string and list lengths, and `@pattern` for regex matching on strings, with the regex support behind an optional feature flag so the library stays at zero default dependencies. Struct-level `@require` annotations let you define cross-field constraints like requiring one field to be less than another, and they work with default values so that if a field is absent but has a schema-defined default, the constraint still evaluates correctly. Schemas can import type definitions from other schema files for reuse across projects, with circular import detection and name collision checking to keep things safe. And the `init` command can infer a starting schema from an existing `.ron` file, so you do not have to write the entire schema by hand if you already have example data. You generate the skeleton and then refine it. The project is published on crates.io as a zero-dependency library crate with the CLI as a separate binary crate, both MIT-licensed and at version 1.0.",
  tools: ['Rust', 'Clap'],
  github: 'https://github.com/Bradley-Hunter/ron-schema-validator',
  githubNote: 'Open source — MIT licensed.',
  files: [
    {
      name: 'recipe.ronschema',
      language: 'rust',
      code: exampleSchema,
    },
    {
      name: 'ron_value.rs',
      language: 'rust',
      code: ronValue,
    },
    {
      name: 'validate.rs — Enum Validation',
      language: 'rust',
      code: enumValidation,
    },
  ],
}
