Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    AUTOMATED GITHUB & VERCEL DEPLOY      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/3] Logging into GitHub..." -ForegroundColor Yellow
Write-Host "Please follow the prompts below to authenticate (use arrow keys and Enter):"
& "C:\Program Files\GitHub CLI\gh.exe" auth login

Write-Host ""
Write-Host "[2/3] Creating GitHub Repository and Pushing Code..." -ForegroundColor Yellow
& "C:\Program Files\GitHub CLI\gh.exe" repo create workflowai --public --source=. --remote=origin --push

Write-Host ""
Write-Host "[3/3] Deploying Frontend to Vercel..." -ForegroundColor Yellow
Write-Host "Please follow the Vercel prompts below (log in if needed, then hit enter to use defaults):"
cd frontend
npx vercel deploy --prod

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Deployment Complete! You can close this " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
