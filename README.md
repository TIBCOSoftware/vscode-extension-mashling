# mashling-vscode-extension
Project Mashling VSCode Extension

Features : 
>auto-complete
>hover-provider
>Json validation
To run the extension follow the instructions below. 
Download vscode from https://code.visualstudio.com/
Clone the repository using following command:
git clone https://git.tibco.com/git/product/tibcolnd.git -b <branch-name> --single-branch <directory-name>
Go to the vscode-mashling-extension folder
and do:
> npm install
> code .
The above installs all dependencies and opens a VS Code instance.
Now click on f5 in the instance. It will take you to the extensions development Host window.
Here, create a json file. 
To trigger auto-complete manually, click ctrl + space OR start typing quotes.
You should be able to see auto-complete suggestions. Also on Hover, it will show information about the symbol/object that's below the mouse cursor.