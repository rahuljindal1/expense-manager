module.exports = {
  extends: [
    "next/core-web-vitals", // Extends Next.js recommended ESLint configuration
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["import"],
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Node.js built-ins: fs, path, etc.
          "external", // External packages: react, next, etc.
          "internal", // Internal modules
          ["parent", "sibling"], // Parent and sibling imports
          "index", // Index imports
        ],
        "newlines-between": "always", // Require a newline between import groups
        alphabetize: {
          order: "asc", // Alphabetize imports within a group in ascending order
          caseInsensitive: true, // Ignore case when alphabetizing
        },
      },
    ],
    "react-hooks/exhaustive-deps": "off",
  },
};
