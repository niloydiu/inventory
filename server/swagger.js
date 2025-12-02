const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const swaggerUi = require('swagger-ui-express');

let spec = null;

function loadSpec() {
  if (spec) return spec;
  const file = path.join(__dirname, 'docs', 'openapi.yaml');
  try {
    const content = fs.readFileSync(file, 'utf8');
    spec = yaml.parse(content);
    return spec;
  } catch (err) {
    console.error('Failed to load OpenAPI spec:', err);
    spec = { openapi: '3.0.1', info: { title: 'API', version: '0.0.0' }, paths: {} };
    return spec;
  }
}

/**
 * Initialize Swagger UI endpoints on the provided Express app.
 * Options:
 *  - apiPrefix: base path for API (default: '/api/v1')
 */
function initSwagger(app, options = {}) {
  const apiPrefix = options.apiPrefix || '/api/v1';
  const docsPath = `${apiPrefix}/docs`;
  const jsonPath = `${apiPrefix}/docs.json`;

  const openapi = loadSpec();

  const shouldMount = process.env.NODE_ENV !== 'production' || process.env.ENABLE_API_DOCS === 'true';
  if (!shouldMount) {
    console.log('Swagger UI not mounted (production and ENABLE_API_DOCS not set)');
    return;
  }

  // Serve raw JSON spec
  app.get(jsonPath, (req, res) => {
    res.json(openapi);
  });

  // Serve Swagger UI
  app.use(docsPath, swaggerUi.serve, swaggerUi.setup(openapi));

  console.log(`Swagger UI available at ${docsPath} (spec: ${jsonPath})`);
}

module.exports = initSwagger;
