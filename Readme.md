# FrayTools Type Definition Plugin Example

## Overview

This repository demonstrates a working FrayTools type definition plugin, which adds a simple global interface named `IMyTypeDefinitionPluginInterface`.

To activate this plugin in FrayTools, you must enable it in the Plugin Manager.

## Basic Setup

* Install [Node.js v16.x or newer](https://nodejs.org/en/) (Latest LTS version is recommended, easiest installation method is to use [NVM](https://github.com/nvm-sh/nvm))
* Run `npm install`
* Run`npm run build`

The build will output the plugin files into a `dist/[PluginName]` folder. You can copy this folder into your FrayTools plugins directory in order to test the plugin in action.

Note that this project uses ES2015 JavaScript in order to demonstrate that TypeScript is not strictly required for plugin creation. Even React is technically not required either - vanilla JS can be used if you bootstrap your DOM following the concepts from the base plugin React classes in the `plugin-core` project. Essentially you just need to set up handlers on  `FrayToolsPluginCore`.
