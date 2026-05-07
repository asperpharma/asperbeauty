#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Health check script for Asper Beauty Shop
.DESCRIPTION
    Runs automated health checks including:
    - Build verification
    - Lint checks
    - Edge Function connectivity (optional)
    - Frontend URL checks
.EXAMPLE
    .\scripts\health-checks.ps1
#>

# Color output functions
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }

# Initialize counters
$script:passed = 0
$script:failed = 0
$script:warnings = 0

Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   Asper Beauty Shop - Health Check Suite      ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

# Get project root (assuming script is in /scripts)
$projectRoot = Split-Path -Parent $PSScriptRoot

# Change to project directory
Push-Location $projectRoot

try {
    # ═══════════════════════════════════════════════════════
    # 1. Environment Check
    # ═══════════════════════════════════════════════════════
    Write-Info "Checking environment..."
    
    # Check Node.js
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = node --version
        Write-Success "Node.js installed: $nodeVersion"
        $script:passed++
    } else {
        Write-Error "Node.js not found. Please install Node.js 18+"
        $script:failed++
    }

    # Check npm
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        $npmVersion = npm --version
        Write-Success "npm installed: $npmVersion"
        $script:passed++
    } else {
        Write-Error "npm not found"
        $script:failed++
    }

    # Check if node_modules exists
    if (Test-Path "node_modules") {
        Write-Success "Dependencies installed"
        $script:passed++
    } else {
        Write-Warning "node_modules not found. Run 'npm install'"
        $script:warnings++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 2. Lint Check
    # ═══════════════════════════════════════════════════════
    Write-Info "Running linter..."
    
    $lintResult = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Lint check passed"
        $script:passed++
    } else {
        Write-Error "Lint check failed"
        Write-Host $lintResult -ForegroundColor DarkGray
        $script:failed++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 3. TypeScript Check
    # ═══════════════════════════════════════════════════════
    Write-Info "Checking TypeScript compilation..."
    
    if (Get-Command npx -ErrorAction SilentlyContinue) {
        $tscResult = npx tsc --noEmit 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "TypeScript compilation passed"
            $script:passed++
        } else {
            Write-Error "TypeScript compilation failed"
            Write-Host $tscResult -ForegroundColor DarkGray
            $script:failed++
        }
    } else {
        Write-Warning "npx not available, skipping TypeScript check"
        $script:warnings++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 4. Build Check
    # ═══════════════════════════════════════════════════════
    Write-Info "Testing production build..."
    
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build succeeded"
        $script:passed++
        
        # Check if dist directory was created
        if (Test-Path "dist") {
            Write-Success "Build artifacts created in dist/"
            $script:passed++
        } else {
            Write-Warning "dist/ directory not found after build"
            $script:warnings++
        }
    } else {
        Write-Error "Build failed"
        Write-Host $buildResult -ForegroundColor DarkGray
        $script:failed++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 5. Environment Variables Check
    # ═══════════════════════════════════════════════════════
    Write-Info "Checking environment variables..."
    
    if (Test-Path ".env") {
        Write-Success ".env file exists"
        $script:passed++
        
        # Check for critical variables
        $envContent = Get-Content ".env" -Raw
        $requiredVars = @(
            "VITE_SUPABASE_URL",
            "VITE_SUPABASE_PUBLISHABLE_KEY",
            "VITE_SHOPIFY_STORE",
            "VITE_SHOPIFY_STOREFRONT_TOKEN"
        )
        
        foreach ($var in $requiredVars) {
            if ($envContent -match $var) {
                Write-Success "$var is set"
                $script:passed++
            } else {
                Write-Warning "$var not found in .env"
                $script:warnings++
            }
        }
    } else {
        Write-Warning ".env file not found"
        $script:warnings++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 6. Frontend URL Check (Optional)
    # ═══════════════════════════════════════════════════════
    Write-Info "Checking frontend URL (optional)..."
    
    $frontendUrl = "https://asperbeautyshop.lovable.app"
    try {
        $response = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible: $frontendUrl"
            $script:passed++
        } else {
            Write-Warning "Frontend returned status code: $($response.StatusCode)"
            $script:warnings++
        }
    } catch {
        Write-Warning "Could not reach frontend URL (may be expected in local/offline environment)"
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor DarkGray
        $script:warnings++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 7. Edge Function Check (Optional)
    # ═══════════════════════════════════════════════════════
    Write-Info "Checking Edge Function (optional)..."
    
    # Load env vars to get anon key
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        $anonKey = ($envContent | Select-String "VITE_SUPABASE_PUBLISHABLE_KEY=(.+)").Matches.Groups[1].Value
        
        if ($anonKey) {
            $edgeUrl = "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant"
            $body = @{ message = "health check" } | ConvertTo-Json
            $headers = @{
                "Authorization" = "Bearer $anonKey"
                "Content-Type" = "application/json"
            }
            
            try {
                $response = Invoke-RestMethod -Uri $edgeUrl -Method Post -Headers $headers -Body $body -TimeoutSec 10 -ErrorAction Stop
                Write-Success "Beauty Assistant Edge Function is responding"
                $script:passed++
            } catch {
                Write-Warning "Beauty Assistant Edge Function not reachable (may be expected if not deployed)"
                Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor DarkGray
                $script:warnings++
            }
        } else {
            Write-Warning "Supabase anon key not found, skipping Edge Function check"
            $script:warnings++
        }
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # 8. Git Status Check
    # ═══════════════════════════════════════════════════════
    Write-Info "Checking Git status..."
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $gitStatus = git status --porcelain 2>&1
        if ($LASTEXITCODE -eq 0) {
            if ([string]::IsNullOrWhiteSpace($gitStatus)) {
                Write-Success "Working directory is clean"
                $script:passed++
            } else {
                Write-Warning "Uncommitted changes detected"
                $script:warnings++
            }
        } else {
            Write-Warning "Not a git repository or git not available"
            $script:warnings++
        }
    } else {
        Write-Warning "Git not installed"
        $script:warnings++
    }

    Write-Host ""

    # ═══════════════════════════════════════════════════════
    # Summary
    # ═══════════════════════════════════════════════════════
    Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║              Health Check Summary              ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "  Passed:   $script:passed" -ForegroundColor Green
    Write-Host "  Failed:   $script:failed" -ForegroundColor Red
    Write-Host "  Warnings: $script:warnings" -ForegroundColor Yellow
    Write-Host ""

    if ($script:failed -eq 0) {
        Write-Success "All critical checks passed! ✓"
        Write-Host ""
        if ($script:warnings -gt 0) {
            Write-Warning "Note: Some optional checks produced warnings. Review above."
        }
        exit 0
    } else {
        Write-Error "Some critical checks failed. Please fix issues above."
        Write-Host ""
        exit 1
    }

} finally {
    # Return to original directory
    Pop-Location
}
