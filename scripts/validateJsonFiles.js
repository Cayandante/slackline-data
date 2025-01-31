const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const jsonFilesToValidate = {
  "../communities/groups/groups.json": {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 7,
          maxLength: 7,
        },
        name: {
          type: "string",
        },
        lat: {
          type: "number",
          minimum: -90,
          maximum: 90,
        },
        lng: {
          type: "number",
          minimum: -180,
          maximum: 180,
        },
        createdDateTime: {
          type: "string",
          format: "date",
        },
        updatedDateTime: {
          type: "string",
          format: "date",
        },
        email: {
          type: "string",
          format: "email",
        },
        facebook: {
          type: "string",
          format: "uri",
          pattern: ".*facebook.com\/.*",
        },
        telegram: {
          type: "string",
          format: "uri",
          pattern: ".*t.me\/.*",
        },
        instagram: {
          type: "string",
          format: "uri",
          pattern: ".*instagram.com\/.*",
        },
        whatsapp: {
          type: "string",
          format: "uri",
          pattern: ".*whatsapp.com\/.*",
        },
        webpage: {
          type: "string",
          format: "uri",
        },
      },
      required: [
        "id",
        "name",
        "lat",
        "lng",
        "createdDateTime",
        "updatedDateTime",
      ],
      additionalProperties: false,
    },
  },
  "../communities/groups/groups.geojson": {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["type", "features"],
    properties: {
      type: {
        type: "string",
        enum: ["FeatureCollection"],
      },
      features: {
        type: "array",
        items: {
          type: "object",
          required: ["type", "properties", "geometry"],
          properties: {
            type: {
              type: "string",
              enum: ["Feature"],
            },
            properties: {
              type: "object",
              required: ["id", "ft"],
              properties: {
                id: {
                  type: "string",
                  minLength: 7,
                  maxLength: 7,
                },
                ft: {
                  type: "string",
                  enum: ["sg"],
                },
              },
            },
            geometry: {
              type: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  type: "string",
                  enum: ["Point", "MultiPoint"],
                },
                coordinates: {
                  type: "array",
                  items: {
                    oneOf: [
                      {
                        type: "number",
                        minimum: -180,
                        maximum: 180,
                      },
                      {
                        type: "array",
                        items: {
                          type: "number",
                          minimum: -180,
                          maximum: 180,
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

for (const [file, schema] of Object.entries(jsonFilesToValidate)) {
  const fileContent = fs.readFileSync(path.join(__dirname, file), "utf8");
  const json = JSON.parse(fileContent);
  const validate = ajv.compile(schema);
  const isValid = validate(json);
  if (!isValid) {
    console.error(`Invalid JSON format for ${file}`);
    console.error(validate.errors);
    process.exit(1);
  }
}
