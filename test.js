import { MCPManager } from './mcp_client.js';
import { OllamaWithMCP } from './ollama_integration.js';

async function testMCPConnection() {
  console.log('🧪 Testing MCP connections...');
  
  const mcpManager = new MCPManager();
  
  try {
    await mcpManager.initializeServers();
    
    console.log('\n✅ MCP servers connected successfully!');
    console.log('📋 Available tools:', mcpManager.getAvailableTools());
    
    // Test a simple tool call
    if (mcpManager.getAvailableTools().includes('search_patients')) {
      console.log('\n🔍 Testing search_patients tool...');
      const result = await mcpManager.callTool('search_patients', { name: 'test' });
      console.log('Result:', JSON.stringify(result, null, 2));
    }
    
    // Test Ollama integration
    console.log('\n🦙 Testing Ollama integration...');
    const ollamaClient = new OllamaWithMCP(mcpManager);
    
    // Check if Ollama is running
    try {
      const models = await ollamaClient.listModels();
      console.log('📦 Available Ollama models:', models.models?.map(m => m.name) || 'None');
      
      // Test a simple chat
      console.log('\n💬 Testing chat...');
      const chatResult = await ollamaClient.chat('Hello, can you search for patients named "test"?');
      console.log('Chat result:', chatResult);
      
    } catch (ollamaError) {
      console.log('⚠️  Ollama not available:', ollamaError.message);
      console.log('Make sure Ollama is running: ollama serve');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mcpManager.close();
  }
}

async function testToolDirectly() {
  console.log('\n🔧 Testing tools directly...');
  
  const mcpManager = new MCPManager();
  await mcpManager.initializeServers();
  
  const tools = mcpManager.getAvailableTools();
  console.log('Available tools:', tools);
  
  // Test each tool with simple parameters
  for (const toolName of tools.slice(0, 3)) { // Test first 3 tools
    try {
      console.log(`\n🧪 Testing ${toolName}...`);
      const toolInfo = mcpManager.getToolInfo(toolName);
      console.log('Tool description:', toolInfo?.description);
      
      // Create simple test arguments based on tool name
      let testArgs = {};
      if (toolName.includes('patient')) {
        testArgs = { name: 'test' };
      } else if (toolName.includes('observation')) {
        testArgs = { patient: 'Patient/test' };
      }
      
      const result = await mcpManager.callTool(toolName, testArgs);
      console.log(`✅ ${toolName} result:`, result ? 'Success' : 'Empty result');
      
    } catch (error) {
      console.log(`❌ ${toolName} error:`, error.message);
    }
  }
  
  await mcpManager.close();
}

// Run tests
console.log('🚀 Starting MCP + Ollama tests...\n');

// Choose which test to run
const testType = process.argv[2] || 'connection';

switch (testType) {
  case 'tools':
    await testToolDirectly();
    break;
  case 'connection':
  default:
    await testMCPConnection();
    break;
}

console.log('\n✨ Tests completed!');
