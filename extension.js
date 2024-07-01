const vscode = require("vscode");
const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const res = await axios.get("https://blog.webdevsimplified.com/rss.xml");

  const parsedData = new XMLParser();
  const articles = parsedData
    .parse(res.data)
    .rss.channel.item.map((article) => ({
      label: article.title,
      detail: article.description,
      link: article.link,
    }));
  console.log(articles);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "search-blog" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "search-blog.searchBlog",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      console.log(article);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
