interface JDoodleCredentials {
  clientId: string;
  clientSecret: string;
}

interface JDoodleResponse {
  output: string;
  statusCode: number;
  memory: string;
  cpuTime: string;
  error?: string;
}

class JDoodleAPI {
  private static instance: JDoodleAPI;
  private currentAccountIndex: number;
  private credentials: JDoodleCredentials[];
  private executionCounts: Map<string, number>;

  private constructor() {
    this.currentAccountIndex = Number(import.meta.env.VITE_CURRENT_ACCOUNT_INDEX) || 1;
    this.credentials = [
      {
        clientId: import.meta.env.VITE_JDOODLE_CLIENT_ID_1,
        clientSecret: import.meta.env.VITE_JDOODLE_CLIENT_SECRET_1,
      },
      {
        clientId: import.meta.env.VITE_JDOODLE_CLIENT_ID_2,
        clientSecret: import.meta.env.VITE_JDOODLE_CLIENT_SECRET_2,
      },
      {
        clientId: import.meta.env.VITE_JDOODLE_CLIENT_ID_3,
        clientSecret: import.meta.env.VITE_JDOODLE_CLIENT_SECRET_3,
      },
    ];
    this.executionCounts = new Map();
  }

  public static getInstance(): JDoodleAPI {
    if (!JDoodleAPI.instance) {
      JDoodleAPI.instance = new JDoodleAPI();
    }
    return JDoodleAPI.instance;
  }

  private getCurrentCredentials(): JDoodleCredentials {
    return this.credentials[this.currentAccountIndex - 1];
  }

  private switchToNextAccount() {
    this.currentAccountIndex = (this.currentAccountIndex % 3) + 1;
    console.log(`Switched to JDoodle account ${this.currentAccountIndex}`);
  }

  private async checkCredits(clientId: string, clientSecret: string): Promise<number> {
    try {
      const response = await fetch('http://localhost:5000/api/jdoodle/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, clientSecret }),
      });
      const data = await response.json();
      return data.used;
    } catch (error) {
      console.error('Error checking JDoodle credits:', error);
      return 0;
    }
  }

  public async executeCode(
    script: string,
    language: string,
    versionIndex: string = "0"
  ): Promise<JDoodleResponse> {
    const credentials = this.getCurrentCredentials();
    
    try {
      const creditsUsed = await this.checkCredits(
        credentials.clientId,
        credentials.clientSecret
      );

      if (creditsUsed >= 200) { 
        this.switchToNextAccount();
        return this.executeCode(script, language, versionIndex); 
      }

      const response = await fetch('http://localhost:5000/api/jdoodle/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          script,
          language,
          versionIndex,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.error) {
        this.switchToNextAccount();
        return this.executeCode(script, language, versionIndex);
      }

      return data;
    } catch (error) {
      console.error('Error executing code:', error);
      return {
        output: 'Error executing code. Please try again.',
        statusCode: 400,
        memory: '0',
        cpuTime: '0',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const jdoodleAPI = JDoodleAPI.getInstance();

// Language configurations for JDoodle
export const languageConfigs = {
  python: { language: 'python3', versionIndex: '4' },
  cpp: { language: 'cpp', versionIndex: '5' },
  java: { language: 'java', versionIndex: '4' },
  nodejs: { language: 'nodejs', versionIndex: '4' },
  bash: { language: 'bash', versionIndex: '4' },
};
