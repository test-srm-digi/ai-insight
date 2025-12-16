// Mock data for development and testing

const sampleVulnerabilities = [
  {
    id: 'CVE-2024-1234',
    package: 'jsonwebtoken',
    version: '8.5.1',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    description: 'Authentication bypass in JWT verification allows attackers to forge valid tokens',
    exploitAvailable: true,
    exploitMaturity: 'Proof of Concept',
    affectedComponent: 'Authentication Module',
    fixVersion: '9.0.2',
    publishedDate: '2024-11-15',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-1234']
  },
  {
    id: 'CVE-2024-2345',
    package: 'express',
    version: '4.17.1',
    severity: 'HIGH',
    cvssScore: 7.5,
    description: 'Path traversal vulnerability in static file middleware',
    exploitAvailable: false,
    exploitMaturity: 'Theoretical',
    affectedComponent: 'API Gateway',
    fixVersion: '4.18.2',
    publishedDate: '2024-10-20',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-2345']
  },
  {
    id: 'CVE-2024-3456',
    package: 'axios',
    version: '0.21.1',
    severity: 'HIGH',
    cvssScore: 7.0,
    description: 'Server-Side Request Forgery (SSRF) vulnerability',
    exploitAvailable: true,
    exploitMaturity: 'Active',
    affectedComponent: 'HTTP Client',
    fixVersion: '1.6.0',
    publishedDate: '2024-09-10',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-3456']
  },
  {
    id: 'CVE-2024-4567',
    package: 'lodash',
    version: '4.17.15',
    severity: 'MEDIUM',
    cvssScore: 5.3,
    description: 'Prototype pollution vulnerability',
    exploitAvailable: false,
    exploitMaturity: 'Theoretical',
    affectedComponent: 'Utility Functions',
    fixVersion: '4.17.21',
    publishedDate: '2024-08-05',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-4567']
  },
  {
    id: 'CVE-2024-5678',
    package: 'moment',
    version: '2.29.1',
    severity: 'MEDIUM',
    cvssScore: 4.7,
    description: 'ReDoS vulnerability in date parsing',
    exploitAvailable: false,
    exploitMaturity: 'None',
    affectedComponent: 'Date Utilities',
    fixVersion: '2.29.4',
    publishedDate: '2024-07-22',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-5678']
  },
  {
    id: 'CVE-2024-6789',
    package: 'helmet',
    version: '4.6.0',
    severity: 'LOW',
    cvssScore: 3.1,
    description: 'Missing security header in specific configuration',
    exploitAvailable: false,
    exploitMaturity: 'None',
    affectedComponent: 'Security Middleware',
    fixVersion: '7.1.0',
    publishedDate: '2024-06-15',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-6789']
  },
  {
    id: 'CVE-2024-7890',
    package: 'cors',
    version: '2.8.4',
    severity: 'LOW',
    cvssScore: 2.5,
    description: 'CORS bypass in edge case configuration',
    exploitAvailable: false,
    exploitMaturity: 'None',
    affectedComponent: 'CORS Middleware',
    fixVersion: '2.8.5',
    publishedDate: '2024-05-10',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-7890']
  }
];

const sampleRelease = {
  name: 'v2.3.4',
  version: '2.3.4',
  date: '2024-12-16',
  vulnerabilities: sampleVulnerabilities,
  previousReleaseStats: {
    version: 'v2.3.3',
    totalVulnerabilities: 4,
    criticalCount: 0,
    highCount: 2,
    mediumCount: 1,
    lowCount: 1,
    riskScore: 45
  },
  dependencies: {
    total: 234,
    directDependencies: 45,
    devDependencies: 89,
    outdated: 23
  }
};

const sampleSecurityDebt = {
  totalVulnerabilities: 127,
  byAge: {
    lessThan30Days: 45,
    thirtyTo60Days: 32,
    sixtyTo90Days: 28,
    moreThan90Days: 22
  },
  bySeverity: {
    critical: 5,
    high: 23,
    medium: 54,
    low: 45
  },
  trend: [
    { month: 'Jul', total: 89, fixed: 34, new: 45 },
    { month: 'Aug', total: 98, fixed: 28, new: 37 },
    { month: 'Sep', total: 105, fixed: 31, new: 38 },
    { month: 'Oct', total: 112, fixed: 25, new: 32 },
    { month: 'Nov', total: 120, fixed: 22, new: 30 },
    { month: 'Dec', total: 127, fixed: 18, new: 25 }
  ],
  fixRate: {
    current: 18,
    average: 26,
    target: 35
  }
};

module.exports = {
  sampleVulnerabilities,
  sampleRelease,
  sampleSecurityDebt
};
