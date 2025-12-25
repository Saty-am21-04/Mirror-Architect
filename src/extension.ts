// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('mirrorArchitect.start', () => {
        const panel = vscode.window.createWebviewPanel(
            'mirrorArchitect',
            'Mirror Architect',
            vscode.ViewColumn.One,
            { 
                enableScripts: true,
                // Only allow the webview to access these specific folders for security
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist')
                ]
            }
        );

        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                case 'requestHint':
                    // Log this to see if the button works!
                    console.log("Button clicked! Sending a mock hint back...");
                    panel.webview.postMessage({
                        command: 'receiveHint',
                        text: "Gemini suggests: Try using a Map for better performance here!"
                    });
                    return;
                }
            },
            undefined,
            context.subscriptions
        );

        vscode.window.onDidChangeTextEditorSelection((event) => {
            const selectedText = event.textEditor.document.getText(event.selections[0]);
            
            if (selectedText.length > 0 && panel) {
                console.log("EXTENSION SENDING:", selectedText); // Check main Debug Console
                
                panel.webview.postMessage({
                    command: 'receiveHint',
                    text: `Analyzing:${selectedText}` // No spaces/newlines
                });
            }
        });        // 1. Get the URI for the compiled React JS and CSS files
        // Note: Check your dist/assets folder names; Vite usually adds a hash to filenames
        // Inside extension.ts
        const scriptUri = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets', 'index.js')
        );
        const styleUri = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets', 'index.css')
        );

        // 2. Set the HTML to load these files
        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="${styleUri}">
                <title>Mirror Architect</title>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="${scriptUri}"></script>
            </body>
            </html>
        `;
    });

    context.subscriptions.push(disposable);
}