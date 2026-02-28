import { defineConfig } from "eslint/config";
import js from "@eslint/js";

const eslintConfig = defineConfig([
  js.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
]);

export default eslintConfig;
