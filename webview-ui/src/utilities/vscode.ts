import type { WebviewApi } from "vscode-webview";

// 1. Declare the magic function injected by VS Code
declare function acquireVsCodeApi<T = unknown>(): WebviewApi<T>;

/**
 * A utility class to manage the VS Code Webview API.
 */
class VSCodeAPIWrapper {
  // 2. Change 'readonly' to allow assignment in constructor, or initialize immediately
  private readonly vsCodeApi: WebviewApi<unknown> | undefined = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : undefined;

  public postMessage(message: any) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log("Mock postMessage (Not in VS Code):", message);
    }
  }

  public getState(): unknown | undefined {
    return this.vsCodeApi?.getState();
  }

  public setState(state: any) {
    this.vsCodeApi?.setState(state);
  }
}

// Export a single instance
export const vscode = new VSCodeAPIWrapper();