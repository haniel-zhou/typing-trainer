import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", ".next-build/**", ".next-archive-*/**", ".next_broken_*/**", "node_modules/**"]
  }
];

export default eslintConfig;
