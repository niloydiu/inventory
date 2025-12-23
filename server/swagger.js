const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");

let spec = null;

function loadSpec() {
  if (spec) return spec;
  
  try {
    // Try multiple paths for serverless compatibility
    const possiblePaths = [
      path.join(__dirname, "docs", "openapi.yaml"),
      path.join(process.cwd(), "server", "docs", "openapi.yaml"),
      path.resolve("./server/docs/openapi.yaml"),
    ];
    
    let content = null;
    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, "utf8");
          console.log(`Loaded OpenAPI spec from: ${filePath}`);
          break;
        }
      } catch (e) {
        // Continue to next path
      }
    }
    
    if (content) {
      spec = yaml.parse(content);
      return spec;
    }
    
    throw new Error("OpenAPI spec file not found in any expected location");
  } catch (err) {
    console.warn("Failed to load OpenAPI spec (this is expected in serverless/production):", err.message);
    spec = {
      openapi: "3.0.1",
      info: { title: "Inventory API", version: "1.0.0" },
      paths: {},
    };
    return spec;
  }
}

/**
 * Initialize Swagger UI endpoints on the provided Express app.
 * Options:
 *  - apiPrefix: base path for API (default: '/api/v1')
 */
function initSwagger(app, options = {}) {
  const apiPrefix = options.apiPrefix || "/api/v1";
  const docsPath = `${apiPrefix}/docs`;
  const jsonPath = `${apiPrefix}/docs.json`;

  // Check if we should mount Swagger BEFORE loading the spec
  const shouldMount =
    process.env.NODE_ENV !== "production" ||
    process.env.ENABLE_API_DOCS === "true";
    
  if (!shouldMount) {
    console.log(
      "Swagger UI not mounted (production and ENABLE_API_DOCS not set)"
    );
    return;
  }

  // Only load spec if we're going to mount Swagger
  const openapi = loadSpec();

  // Serve raw JSON spec
  app.get(jsonPath, (req, res) => {
    res.json(openapi);
  });

  // Serve Swagger UI
  app.use(docsPath, swaggerUi.serve, swaggerUi.setup(openapi));

  console.log(`Swagger UI available at ${docsPath} (spec: ${jsonPath})`);
}

module.exports = initSwagger;
