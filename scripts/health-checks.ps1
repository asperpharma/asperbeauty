# Asper Beauty Shop - Health Check Script
# Purpose: Automated health checks for the system
# Run from project root: .\scripts\health-checks.ps1

param(
    [switch]$SkipBuild,
    [switch]$SkipEdgeFunctions,
    [string]$SupabaseUrl = "https://rgehleqcubtmcwyipyvi.supabase.co",
    [string]$AnonKey = $env:VITE_SUPABASE_ANON_KEY
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Asper Beauty Shop - Health Checks" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0

# Function to log results
function Log-Result {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )
    
    switch ($Status) {
        "PASS" { Write-Host "✓ $Message" -ForegroundColor Green }
        "FAIL" { 
            Write-Host "✗ $Message" -ForegroundColor Red
            $script:ErrorCount++
        }
        "WARN" { 
            Write-Host "⚠ $Message" -ForegroundColor Yellow
            $script:WarningCount++
        }
        "INFO" { Write-Host "ℹ $Message" -ForegroundColor Cyan }
    }
}

# Check 1: Node.js version
Write-Host "`n[1/6] Checking Node.js version..." -ForegroundColor White
try {
    $nodeVersion = node --version
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($majorVersion -ge 18) {
        Log-Result "Node.js version: $nodeVersion" -Status "PASS"
    } else {
        Log-Result "Node.js version $nodeVersion is too old (need 18+)" -Status "FAIL"
    }
} catch {
    Log-Result "Node.js not found or not in PATH" -Status "FAIL"
}

# Check 2: Dependencies installed
Write-Host "`n[2/6] Checking dependencies..." -ForegroundColor White
if (Test-Path "node_modules") {
    Log-Result "node_modules directory exists" -Status "PASS"
} else {
    Log-Result "node_modules not found - run 'npm install'" -Status "FAIL"
}

# Check 3: Linting
Write-Host "`n[3/6] Running ESLint..." -ForegroundColor White
try {
    $lintOutput = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Result "Linting passed with no errors" -Status "PASS"
    } else {
        Log-Result "Linting failed - check output above" -Status "FAIL"
        Write-Host $lintOutput -ForegroundColor DarkGray
    }
} catch {
    Log-Result "Failed to run linter" -Status "FAIL"
}

# Check 4: TypeScript compilation
Write-Host "`n[4/6] Checking TypeScript..." -ForegroundColor White
try {
    $tscOutput = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Result "TypeScript compilation successful" -Status "PASS"
    } else {
        Log-Result "TypeScript errors found" -Status "WARN"
        Write-Host $tscOutput -ForegroundColor DarkGray
    }
} catch {
    Log-Result "Failed to run TypeScript check" -Status "FAIL"
}

# Check 5: Build
if (-not $SkipBuild) {
    Write-Host "`n[5/6] Running production build..." -ForegroundColor White
    try {
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Log-Result "Production build successful" -Status "PASS"
            
            # Check dist folder
            if (Test-Path "dist") {
                $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
                Log-Result "dist/ folder created (${distSize:N2} MB)" -Status "INFO"
            }
        } else {
            Log-Result "Build failed - check output above" -Status "FAIL"
            Write-Host $buildOutput -ForegroundColor DarkGray
        }
    } catch {
        Log-Result "Failed to run build" -Status "FAIL"
    }
} else {
    Write-Host "`n[5/6] Skipping build (--SkipBuild flag)" -ForegroundColor DarkGray
}

# Check 6: Edge Functions health
if (-not $SkipEdgeFunctions) {
    Write-Host "`n[6/6] Checking Edge Functions..." -ForegroundColor White
    
    if ([string]::IsNullOrEmpty($AnonKey)) {
        Log-Result "VITE_SUPABASE_ANON_KEY not set - skipping Edge Function checks" -Status "WARN"
    } else {
        # Test beauty-assistant function
        try {
            $body = @{
                message = "health check"
            } | ConvertTo-Json
            
            $headers = @{
                "Authorization" = "Bearer $AnonKey"
                "Content-Type" = "application/json"
            }
            
            $response = Invoke-RestMethod -Uri "$SupabaseUrl/functions/v1/beauty-assistant" `
                -Method POST `
                -Headers $headers `
                -Body $body `
                -TimeoutSec 10 `
                -ErrorAction Stop
            
            if ($response.reply) {
                Log-Result "beauty-assistant function is responding" -Status "PASS"
            } else {
                Log-Result "beauty-assistant returned unexpected response" -Status "WARN"
            }
        } catch {
            if ($_.Exception.Response.StatusCode -eq 401) {
                Log-Result "beauty-assistant function found but authentication failed" -Status "WARN"
            } else {
                Log-Result "beauty-assistant function not reachable: $($_.Exception.Message)" -Status "FAIL"
            }
        }
    }
} else {
    Write-Host "`n[6/6] Skipping Edge Functions (--SkipEdgeFunctions flag)" -ForegroundColor DarkGray
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Health Check Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "✓ All checks passed!" -ForegroundColor Green
    exit 0
} elseif ($ErrorCount -eq 0) {
    Write-Host "⚠ Checks completed with $WarningCount warning(s)" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "✗ Checks failed with $ErrorCount error(s) and $WarningCount warning(s)" -ForegroundColor Red
    exit 1
}
