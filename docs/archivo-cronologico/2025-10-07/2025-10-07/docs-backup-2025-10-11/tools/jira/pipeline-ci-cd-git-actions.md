name: SGICS Sprint 2 CI/CD Pipeline

on:
  push:
    branches: [ main, develop, 'feature/*', 'hotfix/*' ]
  pull_request:
    branches: [ main, develop ]

env:
  SONAR_PROJECT_KEY: "sgics-scouts-biobio"
  SONAR_ORG: "SC_REGBIOBIO"
  JIRA_BASE_URL: "https://inacapmail-team-z3fibirj.atlassian.net"

jobs:
  # ==================== BACKEND PIPELINE ====================
  backend-ci:
    name: Backend CI/CD
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./codigo/backend
        
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0  # SonarQube needs full history
        
    - name: 🐍 Setup Python 3.11
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        cache: 'pip'
        
    - name: 📦 Install Dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest-cov bandit safety
        
    - name: 🔍 Security Scan with Bandit
      run: |
        bandit -r . -f json -o bandit-report.json || true
        
    - name: 🛡️ Dependency Vulnerability Check
      run: |
        safety check --json --output safety-report.json || true
        
    - name: 🧪 Run Tests with Coverage
      run: |
        pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest-results.xml
        
    - name: 📊 SonarQube Quality Gate
      uses: sonarqube-quality-gate-action@master
      with:
        scanMetadataReportFile: .scannerwork/report-task.txt
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        
    - name: 🐳 Build Docker Image
      run: |
        docker build -t sgics-backend:${{ github.sha }} .
        docker tag sgics-backend:${{ github.sha }} sgics-backend:latest
        
    - name: 🚀 Deploy to Staging (if main branch)
      if: github.ref == 'refs/heads/main'
      run: |
        echo "Deploying backend to staging environment"
        # Deployment commands here
        
    - name: 📝 Update Jira Issues
      if: github.event_name == 'push'
      uses: atlassian/gajira-transition@master
      with:
        issue: ${{ github.event.head_commit.message | regexMatch('[A-Z]+-[0-9]+') }}
        transition: "In Development"
      env:
        JIRA_BASE_URL: ${{ env.JIRA_BASE_URL }}
        JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
        JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}

  # ==================== FRONTEND PIPELINE ====================  
  frontend-ci:
    name: Frontend CI/CD
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./codigo/frontend
        
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 📦 Setup Node.js 18
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: codigo/frontend/package-lock.json
        
    - name: 📦 Install Dependencies
      run: npm ci
      
    - name: 🔍 Lint Code
      run: npm run lint
      
    - name: 🧪 Run Unit Tests
      run: npm run test:unit -- --coverage
      
    - name: 🧪 Run E2E Tests (Playwright)
      run: |
        npx playwright install
        npm run test:e2e
        
    - name: 🏗️ Build Application
      run: npm run build
      
    - name: 📊 SonarQube Analysis
      uses: sonarqube-scanner-action@master
      with:
        projectBaseDir: codigo/frontend
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
        
    - name: 🐳 Build Docker Image
      run: |
        docker build -t sgics-frontend:${{ github.sha }} .
        docker tag sgics-frontend:${{ github.sha }} sgics-frontend:latest
        
    - name: 🚀 Deploy to Staging
      if: github.ref == 'refs/heads/main' 
      run: |
        echo "Deploying frontend to staging environment"
        # Deployment logic here

  # ==================== INTEGRATION TESTS ====================
  integration-tests:
    name: Integration Tests
    needs: [backend-ci, frontend-ci]
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: sgics_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 🐳 Start Application Stack
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30  # Wait for services to be ready
        
    - name: 🧪 Run Integration Tests
      run: |
        docker-compose -f docker-compose.test.yml exec -T backend pytest tests/integration/
        
    - name: 🧪 Run API Contract Tests
      run: |
        # Newman/Postman collection tests
        npx newman run postman/sgics-api-tests.json
        
    - name: 📊 Collect Test Results
      run: |
        docker-compose -f docker-compose.test.yml logs > integration-test-logs.txt
        
    - name: 🧹 Cleanup
      if: always()
      run: |
        docker-compose -f docker-compose.test.yml down -v

  # ==================== NOTIFICATION ====================
  notify-status:
    name: Notify Build Status  
    needs: [backend-ci, frontend-ci, integration-tests]
    if: always()
    runs-on: ubuntu-latest
    
    steps:
    - name: 📬 Discord Notification
      uses: sarisia/actions-status-discord@v1
      with:
        webhook: ${{ secrets.DISCORD_WEBHOOK }}
        status: ${{ job.status }}
        title: "SGICS Sprint 2 Build"
        description: |
          **Branch:** ${{ github.ref_name }}
          **Commit:** ${{ github.sha }}
          **Author:** ${{ github.actor }}
          
    - name: 📝 Update Jira on Success
      if: success() && github.event_name == 'push'
      uses: atlassian/gajira-transition@master
      with:
        issue: ${{ github.event.head_commit.message | regexMatch('[A-Z]+-[0-9]+') }}
        transition: "QA Testing"
      env:
        JIRA_BASE_URL: ${{ env.JIRA_BASE_URL }}
        JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
        JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}