import { MCPManager } from './mcp_client.js';
import { OllamaWithMCP } from './ollama_integration.js';

async function testFormatting() {
  console.log('🧪 Testing Clean Formatting\n');
  
  try {
    const mcpManager = new MCPManager();
    await mcpManager.initializeServers();
    
    const ollamaClient = new OllamaWithMCP(mcpManager);
    
    console.log('✅ System initialized\n');
    
    // Test with a query that should work
    const query = "Search for patients named test";
    
    console.log(`🔍 Testing query: "${query}"`);
    console.log('🤔 Processing...\n');
    
    const result = await ollamaClient.chat(query);
    
    if (result.toolUsed) {
      console.log(`✅ Success!`);
      console.log(`🔧 Tool used: ${result.toolUsed}`);
      console.log(`🤖 AI Response (formatted):`);
      console.log('─'.repeat(50));
      console.log(result.finalResponse);
      console.log('─'.repeat(50));
    } else if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else {
      console.log(`🤖 Regular response: ${result.response}`);
    }
    
    await mcpManager.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFormatting();
