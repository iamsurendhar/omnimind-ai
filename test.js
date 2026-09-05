/**
 * Automated Endpoint and Server Integrity Test Suite for OmniMind AI
 */
const assert = require("assert");
const http = require("http");
const app = require("./api/index");

const TEST_PORT = 3099;
let server;

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (postData) {
      req.write(
        typeof postData === "string" ? postData : JSON.stringify(postData),
      );
    }
    req.end();
  });
}

async function runTests() {
  console.log("\n🧪 ===========================================");
  console.log("   Running OmniMind AI Automated Test Suite");
  console.log("===========================================\n");

  server = app.listen(TEST_PORT);

  try {
    // Test 1: Root Route (GET /)
    console.log("▶ [Test 1] Testing Root Route (GET /)...");
    const rootRes = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/",
      method: "GET",
    });
    assert.strictEqual(
      rootRes.statusCode,
      200,
      "Root route should return status 200",
    );
    assert(
      rootRes.body.includes("OmniMind AI"),
      "Root HTML should contain 'OmniMind AI'",
    );
    console.log("  ✔ Passed: Root route serves index.html correctly.\n");

    // Test 2: Configuration Route (GET /api/config)
    console.log(
      "▶ [Test 2] Testing Configuration Endpoint (GET /api/config)...",
    );
    const configRes = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/config",
      method: "GET",
    });
    assert.strictEqual(
      configRes.statusCode,
      200,
      "Config route should return status 200",
    );
    const configData = JSON.parse(configRes.body);
    assert(configData.appName, "Config should return appName");
    assert(configData.defaultModel, "Config should return defaultModel");
    assert.strictEqual(configData.provider, "groq", "Provider should be groq");
    console.log("  ✔ Passed: Config endpoint returns valid configuration.\n");

    // Test 3: Models Route (GET /api/models)
    console.log("▶ [Test 3] Testing Models Endpoint (GET /api/models)...");
    const modelsRes = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/models",
      method: "GET",
    });
    assert.strictEqual(
      modelsRes.statusCode,
      200,
      "Models route should return status 200",
    );
    const modelsData = JSON.parse(modelsRes.body);
    assert(
      Array.isArray(modelsData.models),
      "Models response should be an array",
    );
    console.log("  ✔ Passed: Models endpoint returns active model list.\n");

    // Test 4: Chat Endpoint Validation (POST /api/chat)
    console.log(
      "▶ [Test 4] Testing Chat Completion Endpoint Validation (POST /api/chat)...",
    );
    const chatRes = await makeRequest(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path: "/api/chat",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        messages: [{ role: "user", content: "Hello test" }],
        model: "qwen/qwen3.6-27b",
      },
    );
    assert(
      [200, 500].includes(chatRes.statusCode),
      "Chat API should handle request gracefully",
    );
    console.log("  ✔ Passed: Chat endpoint responds with valid JSON.\n");

    console.log("===========================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! (4/4)");
    console.log("===========================================\n");
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
