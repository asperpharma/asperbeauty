#!/usr/bin/env node

/**
 * Deployment Readiness Checker
 * Validates that all required configurations are in place before deployment
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', colors.red);
    log('   Create .env file from .env.example', colors.yellow);
    return false;
  }
  log('✅ .env file exists', colors.green);
  return true;
}

function checkEnvVariables() {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'VITE_SHOPIFY_STORE',
    'VITE_SHOPIFY_STOREFRONT_TOKEN',
  ];

  const optionalVars = [
    'VITE_HCAPTCHA_SITE_KEY',
  ];

  const placeholders = [
    'your-',
    'placeholder',
    'example',
    'test-',
  ];

  let allRequired = true;
  let hasWarnings = false;

  log('\n📋 Checking Required Environment Variables:', colors.bold);
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      log(`   ❌ ${varName} - MISSING`, colors.red);
      allRequired = false;
    } else if (placeholders.some(p => value.includes(p))) {
      log(`   ⚠️  ${varName} - Appears to be a placeholder`, colors.yellow);
      allRequired = false;
    } else {
      log(`   ✅ ${varName} - Configured`, colors.green);
    }
  });

  log('\n📋 Checking Optional Environment Variables:', colors.bold);
  
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      log(`   ⚠️  ${varName} - Not configured (optional)`, colors.yellow);
      hasWarnings = true;
    } else if (placeholders.some(p => value.includes(p))) {
      log(`   ⚠️  ${varName} - Appears to be a placeholder (optional)`, colors.yellow);
      hasWarnings = true;
    } else {
      log(`   ✅ ${varName} - Configured`, colors.green);
    }
  });

  return { allRequired, hasWarnings };
}

function checkBuildFiles() {
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    log('\n✅ Build directory exists', colors.green);
    return true;
  } else {
    log('\n⚠️  Build directory not found', colors.yellow);
    log('   Run: npm run build', colors.yellow);
    return false;
  }
}

function checkPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json not found', colors.red);
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  log('\n📦 Package Information:', colors.bold);
  log(`   Name: ${pkg.name}`, colors.blue);
  log(`   Version: ${pkg.version}`, colors.blue);
  
  const requiredScripts = ['dev', 'build', 'preview'];
  const missingScripts = requiredScripts.filter(script => !pkg.scripts?.[script]);
  
  if (missingScripts.length > 0) {
    log(`   ❌ Missing scripts: ${missingScripts.join(', ')}`, colors.red);
    return false;
  }
  
  log('   ✅ All required scripts present', colors.green);
  return true;
}

function checkSupabaseFunctions() {
  const functionsPath = path.join(process.cwd(), 'supabase', 'functions');
  if (!fs.existsSync(functionsPath)) {
    log('\n⚠️  Supabase functions directory not found', colors.yellow);
    return false;
  }

  const functions = fs.readdirSync(functionsPath)
    .filter(f => {
      const stat = fs.statSync(path.join(functionsPath, f));
      return stat.isDirectory();
    });

  log('\n🔧 Supabase Edge Functions:', colors.bold);
  log(`   Found ${functions.length} functions:`, colors.blue);
  functions.forEach(fn => {
    const indexPath = path.join(functionsPath, fn, 'index.ts');
    if (fs.existsSync(indexPath)) {
      log(`   ✅ ${fn}`, colors.green);
    } else {
      log(`   ⚠️  ${fn} (missing index.ts)`, colors.yellow);
    }
  });

  return true;
}

function printDeploymentChecklist() {
  log('\n📝 Deployment Checklist:', colors.bold);
  log('   [ ] Environment variables configured', colors.blue);
  log('   [ ] Supabase Edge Functions deployed', colors.blue);
  log('   [ ] Build tested locally (npm run build && npm run preview)', colors.blue);
  log('   [ ] All integrations tested', colors.blue);
  log('   [ ] hCaptcha configured (if using authentication)', colors.blue);
  log('   [ ] Production domain added to Shopify allowed origins', colors.blue);
  log('   [ ] Production domain added to hCaptcha allowed domains', colors.blue);
}

function main() {
  log('\n╔═══════════════════════════════════════════════════════╗', colors.blue);
  log('║   Asper Beauty Shop - Deployment Readiness Check   ║', colors.blue);
  log('╚═══════════════════════════════════════════════════════╝\n', colors.blue);

  const checks = {
    envFile: checkEnvFile(),
    packageJson: checkPackageJson(),
  };

  // Only check env vars if .env file exists
  if (checks.envFile) {
    require('dotenv').config();
    const envCheck = checkEnvVariables();
    checks.envVars = envCheck.allRequired;
    checks.hasWarnings = envCheck.hasWarnings;
  }

  checks.supabaseFunctions = checkSupabaseFunctions();
  checks.buildFiles = checkBuildFiles();

  printDeploymentChecklist();

  // Summary
  log('\n' + '═'.repeat(60), colors.blue);
  const allPassed = Object.values(checks).every(v => v === true);
  
  if (allPassed) {
    log('\n✅ All checks passed! Ready for deployment.', colors.green);
    process.exit(0);
  } else if (checks.envFile && checks.packageJson && checks.envVars) {
    log('\n⚠️  Some optional checks failed. Review warnings above.', colors.yellow);
    process.exit(0);
  } else {
    log('\n❌ Deployment readiness check failed. Fix errors above before deploying.', colors.red);
    process.exit(1);
  }
}

main();
