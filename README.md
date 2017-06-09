# mashling-vscode-extension

Project Mashling VSCode Extension

## Features

* __intellisense__ : Provides word based completions for mashling json property names.

* __code completion snippets__ : Provides json snippets for gateway json body and other subsections.

* __hover-provider__ : Provides information for property names on hover.

* __Json validation__ : Validates the json against predefined schema.

* __Create mashling gateway__ : Once the json is ready , mashling gateway can be created directly through vscode command palette.

* __Create sample gateway__ : A sample mashling gateway can be created directly through vscode command palette.

* __Install and update mashling-cli__ : Install or update mashling just by running a vscode command.

Press `Ctrl + shift + p` and search for the commands starting with `Mashling`. Following commands are available:

![mashling-command-list.png](extras/mashling-command-list.png?raw=true)

## Installing the extension

You can install the extension using the VS Code --install-extension command line switch.
First download the mashling-support-0.0.1.vsix file and navigate to the folder. Then run the command:
```
code --install-extension mashling-support-0.0.1.vsix
```
Alternatively You can manually install a VS Code extension packaged in a .vsix file. Using the Install from VSIX... command in the Extensions View command drop-down, or the Extensions: Install from VSIX... command in the Command Palette, point to the .vsix file.

## Known Issues

This release has been tested on Microsoft Windows 10.

## Contributors

[Tanvi Bhatia](https://github.com/tbhatia1912)

## Release Notes

### 0.0.1
Initial release of mashling-support on Windows

## License
Copyright © 2017. TIBCO Software Inc.
This file is subject to the license terms contained
in the license file that is distributed with this file.
