import path from "node:path";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const projectRoot = process.cwd();

function getArchitectureLocation(filePath) {
  const relativePath = path
    .relative(projectRoot, filePath)
    .replaceAll(path.sep, "/");
  const [layer, slice] = relativePath.split("/");

  if (layer === "shared" || layer === "app") {
    return { layer };
  }

  if (layer === "features" && slice) {
    return { layer, slice };
  }

  return null;
}

function resolveProjectImport(importerPath, importSource) {
  if (importSource.startsWith("@/")) {
    return path.resolve(projectRoot, importSource.slice(2));
  }

  if (importSource.startsWith(".")) {
    return path.resolve(path.dirname(importerPath), importSource);
  }

  return null;
}

const architecturePlugin = {
  rules: {
    "layer-dependencies": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          upward:
            "{{sourceLayer}} 레이어는 {{targetLayer}} 레이어를 import할 수 없습니다.",
          crossFeature:
            "feature 간 직접 import는 금지됩니다: {{sourceFeature}} → {{targetFeature}}",
        },
      },
      create(context) {
        const importerPath = context.getFilename();
        const sourceLocation = getArchitectureLocation(importerPath);

        if (!sourceLocation) {
          return {};
        }

        function checkImport(node) {
          const importSource = node.source?.value;

          if (typeof importSource !== "string") {
            return;
          }

          const resolvedImport = resolveProjectImport(importerPath, importSource);

          if (!resolvedImport) {
            return;
          }

          const targetLocation = getArchitectureLocation(resolvedImport);

          if (!targetLocation) {
            return;
          }

          const isSharedImportingUpward =
            sourceLocation.layer === "shared" &&
            (targetLocation.layer === "features" ||
              targetLocation.layer === "app");
          const isFeatureImportingApp =
            sourceLocation.layer === "features" &&
            targetLocation.layer === "app";

          if (isSharedImportingUpward || isFeatureImportingApp) {
            context.report({
              node,
              messageId: "upward",
              data: {
                sourceLayer: sourceLocation.layer,
                targetLayer: targetLocation.layer,
              },
            });
            return;
          }

          const isCrossFeatureImport =
            sourceLocation.layer === "features" &&
            targetLocation.layer === "features" &&
            sourceLocation.slice !== targetLocation.slice;

          if (isCrossFeatureImport) {
            context.report({
              node,
              messageId: "crossFeature",
              data: {
                sourceFeature: sourceLocation.slice,
                targetFeature: targetLocation.slice,
              },
            });
          }
        }

        return {
          ImportDeclaration: checkImport,
          ImportExpression: checkImport,
          ExportAllDeclaration: checkImport,
          ExportNamedDeclaration: checkImport,
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "features/**/*.{js,jsx,ts,tsx}",
      "shared/**/*.{js,jsx,ts,tsx}",
    ],
    plugins: {
      architecture: architecturePlugin,
    },
    rules: {
      "architecture/layer-dependencies": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "test-results/**",
    "playwright-report/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
