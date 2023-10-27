/**
 * Custom language definition from https://microsoft.github.io/monaco-editor/monarch.html
 * (in Monarch format)
 */
export const keywords = [
  "ABS",
  "SQRT",
  "POW",
  "LOG",
  "LOG10",
  "LN2",
  "LN10",
  "LOG10E",
  "LOG2E",
  "PI",
  "E",
  "ACOS",
  "ASIN",
  "ATAN",
  "COS",
  "SIN",
  "TAN"
]

export default {
  tokenPostfix: ".math",
  keywords,

  operators: [
    "=",
    "<",
    ">",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "===",
    "<<=",
    ">>=",
    ">>>="
  ],

  // common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      [
        /@?[a-zA-Z][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "variable"
          }
        }
      ],
      [/[A-Z][\w$]*/, "type.identifier"],
      [/".*?"/, "string"],

      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()[\]]/, "brackets"],
      // [/[<>](?!@symbols)/, "@brackets"],

      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": ""
          }
        }
      ],

      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      [/@\s*[a-zA-Z_$][\w$]*/, { token: "annotation", log: "annotation token: $0" }],

      // numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

      // characters
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],

    comment: [
      [/[^/*]+/, "comment"],
      [/[/*]/, "comment"],
      [/\/\//, "comment"]
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ]
  }
}
