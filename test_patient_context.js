import { MCPManager } from './mcp_client.js';
import { OllamaWithMCP } from './ollama_integration.js';

async function testPatientContext() {
  console.log('🧪 Testing Patient Context Extraction\n');
  
  try {
    const mcpManager = new MCPManager();
    await mcpManager.initializeServers();
    
    const ollamaClient = new OllamaWithMCP(mcpManager);
    
    console.log('✅ System initialized\n');
    
    // Test the specific query that was failing
    const query = "Use the get_patient_context tool for Patient/patient-diabetes-001";
    
    console.log(`🔍 Testing query: "${query}"`);
    console.log('🤔 Processing...\n');
    
    const result = await ollamaClient.chat(query);
    
    if (result.toolUsed) {
      console.log(`✅ Success!`);
      console.log(`🔧 Tool used: ${result.toolUsed}`);
      console.log(`📊 Tool args: ${JSON.stringify(result.toolResult, null, 2)}`);
      console.log(`🤖 AI Response: ${result.finalResponse}`);
    } else if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      console.log(`📝 Raw response: ${result.rawResponse}`);
    } else {
      console.log(`🤖 Regular response: ${result.response}`);
    }
    
    await mcpManager.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPatientContext();
