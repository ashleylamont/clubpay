# You need to have AzureAD installed
# Run `Install-Module AzureAD` to install it if you don't have it

# Dev Flag
$dev = $true

# Connect to Azure
$connection = Connect-AzureAD
Write-Host "Connected to Azure as $($connection.Account.Id)`n"

# Get the tenant ID
$tenantId = (Get-AzureADTenantDetail).ObjectId

# Set properties
# App Name - This is the name of our app
$appName = "CSSA OIDC App"
if ($dev) {
    $appName += " Dev"
}
# App URI - This is the URI of our app
$appUri = "api://cssa-oidc-app"
if ($dev) {
    $appUri += "-dev"
}
# App Home Page - This is the home page of our app
$appHomePage = "https://something.cssa.club"
if ($dev) {
    $appHomePage = "http://localhost:3000"
}
# Reply URLs - The valid reply URLs for our app
$replyURLs = @(
"http://localhost:3000",
"https://something.cssa.club",
"http://localhost:3000/callback"
)


Write-Host "`n`nCreating/Updating Azure AD Application:"
Write-Host "------------------------------`n"
Write-Host "Tenant ID: $tenantId"
Write-Host "App Name: $appName"
Write-Host "App URI: $appUri"
Write-Host "App Home Page: $appHomePage"
Write-Host "App Reply URLs: $replyURLs`n"

# Check if the app exists
$app = Get-AzureADApplication -Filter "DisplayName eq '$appName'"

# If the app doesn't exist, create it
if (!$app) {
    Write-Host "`nApplication does not exist, creating now..."
    $app = New-AzureADApplication -DisplayName $appName -HomePage $appHomePage -IdentifierUris $appUri -ReplyUrls $replyURLs
    Write-Host "Application created successfully!`n"
} else {
    Write-Host "`nApplication already exists, checking properties..."
}

# Check that all the properties are correct
# Update the app if they aren't
if ($app.Homepage -ne $appHomePage) {
    Write-Host "Updating Home Page..."
    Set-AzureADApplication -ObjectId $app.ObjectId -HomePage $appHomePage
    Write-Host "Home Page updated successfully!`n"
}

if ($app.IdentifierUris -ne $appUri) {
    Write-Host "Updating App URI..."
    Set-AzureADApplication -ObjectId $app.ObjectId -IdentifierUris $appUri
    Write-Host "App URI updated successfully!`n"
}

$replyUrlsMatch = Compare-Object -ReferenceObject $app.ReplyUrls -DifferenceObject $replyURLs -SyncWindow 0
if ($replyUrlsMatch) {
    Write-Host "Updating Reply URLs..."
    Set-AzureADApplication -ObjectId $app.ObjectId -ReplyUrls $replyURLs
    Write-Host "Reply URLs updated successfully!`n"
}

Write-Host "`nApplication Properties:"
Write-Host "------------------------------`n"
Write-Host "App Name: $($app.DisplayName)"
Write-Host "App ID: $($app.AppId)"
Write-Host "App URI: $($app.IdentifierUris)"
Write-Host "App Home Page: $($app.Homepage)"
Write-Host "App Reply URLs: $($app.ReplyUrls)`n"

# Create the Service Principal
$sp = Get-AzureADServicePrincipal -Filter "AppId eq '$($app.AppId)'"
if (!$sp) {
    $sp = New-AzureADServicePrincipal -AppId $app.AppId
    if (!$sp) {
        Write-Host "Failed to create the Service Principal"
        return
    }
}

Write-Host "Service Principal ID: $($sp.ObjectId)"

Write-Host "`nCreating/Updating Client Secret:"
Write-Host "------------------------------`n"

# Get the client secret
$clientSecrets = Get-AzureADApplicationPasswordCredential -ObjectId $app.ObjectId

# Delete existing client secrets
if ($clientSecrets) {
    Write-Host "Deleting existing client secrets..."
    foreach ($clientSecret in $clientSecrets) {
        Remove-AzureADApplicationPasswordCredential -ObjectId $app.ObjectId -KeyId $clientSecret.KeyId
    }
    Write-Host "Existing client secrets deleted."
}

# Create a new client secret
$clientSecret = New-AzureADApplicationPasswordCredential -ObjectId $app.ObjectId
if (!$clientSecret) {
    Write-Host "Failed to create the client secret"
    return
}
Write-Host "New Client Secret: $($clientSecret.Value)"
