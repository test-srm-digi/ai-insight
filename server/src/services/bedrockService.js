const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

class BedrockService {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });
    this.modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';
  }

  async invokeModel(prompt, systemPrompt = '') {
    try {
      const messages = [
        {
          role: 'user',
          content: prompt,
        },
      ];

      const body = JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4096,
        system: systemPrompt || this.getDefaultSystemPrompt(),
        messages,
      });

      const command = new InvokeModelCommand({
        modelId: this.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body,
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody.content[0].text;
    } catch (error) {
      console.error('Bedrock API Error:', error);
      throw new Error(`Failed to invoke Bedrock model: ${error.message}`);
    }
  }

  getDefaultSystemPrompt() {
    return `You are RSI (Release Security Intelligence), an expert AI security analyst specializing in vulnerability assessment, risk prioritization, and actionable security recommendations.

Your role is to:
1. Analyze security vulnerabilities and CVEs in plain, understandable English
2. Prioritize risks based on real-world exploitability, not just severity scores
3. Provide actionable, time-estimated remediation steps
4. Explain technical concepts to non-technical stakeholders
5. Identify patterns and predict security trends
6. Reduce alert fatigue by highlighting what truly matters

Always respond with structured, actionable insights. Use clear categories like URGENT, HIGH PRIORITY, MEDIUM, and MONITOR.
When analyzing risks, consider: exploitability, attack surface, business impact, and fix complexity.`;
  }

  async analyzeReleaseRisk(releaseData) {
    const prompt = `Analyze this release for security risks and provide a comprehensive risk assessment:

Release: ${releaseData.name || releaseData.version}
Vulnerabilities Found:
${JSON.stringify(releaseData.vulnerabilities, null, 2)}

Previous Release Stats:
${JSON.stringify(releaseData.previousReleaseStats || {}, null, 2)}

Provide:
1. Overall Risk Score (0-100) with color code (GREEN/YELLOW/ORANGE/RED)
2. Executive Summary (2-3 sentences for non-technical stakeholders)
3. Risk comparison to previous releases
4. Top 3 concerns requiring immediate attention
5. Recommended release decision (GO/CONDITIONAL GO/NO-GO)

Format your response as JSON.`;

    return this.invokeModel(prompt);
  }

  async generatePriorityAnalysis(vulnerabilities) {
    const prompt = `Analyze these vulnerabilities and create a prioritized action plan:

Vulnerabilities:
${JSON.stringify(vulnerabilities, null, 2)}

For each vulnerability, provide:
1. Priority tier (URGENT/HIGH/MEDIUM/MONITOR)
2. "Fix this first because..." explanation
3. Estimated fix time
4. Related vulnerabilities that should be fixed together
5. Impact if ignored

Also identify:
- Quick wins (easy fixes with significant risk reduction)
- Noise (theoretical vulnerabilities unlikely to impact in practice)

Format response as JSON with actionable steps.`;

    return this.invokeModel(prompt);
  }

  async analyzeSecurityDebt(debtData) {
    const prompt = `Analyze this security debt data and provide insights:

Current Vulnerabilities by Age:
${JSON.stringify(debtData.byAge, null, 2)}

Vulnerability Trend (last 6 months):
${JSON.stringify(debtData.trend, null, 2)}

Fix Rate:
${JSON.stringify(debtData.fixRate, null, 2)}

Provide:
1. Debt accumulation analysis
2. Prediction for next quarter at current pace
3. Resource cost estimate
4. Recommendations to reduce debt
5. Risk trajectory assessment

Format as JSON with clear metrics and recommendations.`;

    return this.invokeModel(prompt);
  }

  async predictDependencyHealth(dependencies) {
    const prompt = `Analyze these dependencies for health and risk indicators:

Dependencies:
${JSON.stringify(dependencies, null, 2)}

For each dependency, assess:
1. Vulnerability trajectory (getting better or worse?)
2. Estimated maintainer responsiveness
3. Community health signals
4. Recommendation (keep/monitor/consider alternatives)

Also provide:
- Overall dependency health score
- Release timing recommendations
- Early warning indicators

Format as JSON.`;

    return this.invokeModel(prompt);
  }

  async chat(message, context = {}) {
    const contextInfo = Object.keys(context).length > 0 
      ? `\n\nContext from current analysis:\n${JSON.stringify(context, null, 2)}`
      : '';

    const prompt = `User question: ${message}${contextInfo}

Provide a helpful, actionable response. If the question is about specific vulnerabilities or risks, provide concrete recommendations. If it's a general security question, explain in plain English suitable for non-technical stakeholders.`;

    return this.invokeModel(prompt);
  }

  async generateExecutiveSummary(releaseData) {
    const prompt = `Generate an executive summary for this security release assessment. The summary should be suitable for C-level executives and non-technical stakeholders.

Release Data:
${JSON.stringify(releaseData, null, 2)}

Write a clear, concise executive summary that includes:
1. Overall security posture assessment (1-2 sentences)
2. Key risks in business terms (not technical jargon)
3. Recommended actions with business impact
4. Release recommendation (proceed/delay/proceed with conditions)

Keep it under 300 words and focus on business impact, not technical details.`;

    return this.invokeModel(prompt);
  }

  async generateRemediationGuide(vulnerabilities) {
    const prompt = `Generate a detailed remediation guide for these vulnerabilities:

${JSON.stringify(vulnerabilities, null, 2)}

For each vulnerability, provide:
1. Step-by-step fix instructions
2. Potential breaking changes to watch for
3. Testing recommendations
4. Rollback plan if issues occur

Format the response as actionable instructions that developers can follow.`;

    return this.invokeModel(prompt);
  }
}

module.exports = new BedrockService();
