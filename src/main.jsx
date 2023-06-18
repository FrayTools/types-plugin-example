import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import FrayToolsPluginCore.js and BaseTypeDefinitionPlugin.js
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BaseTypeDefinitionPlugin from '@fraytools/plugin-core/lib/base/BaseTypeDefinitionPlugin';

/**
 * Example view for the script types plugin.
 * Note: Types plugins run hidden in the background and thus will not be visible.
 */
class MyTypeDefinitionPlugin extends BaseTypeDefinitionPlugin {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<MyTypeDefinitionPlugin {...props} />, document.querySelector('.MyTypeDefinitionPluginWrapper'));
  }

  /**
   * Provide type definition data to inject here. This function will be called automatically when a 'getTypes' message is received via postMessage().
   * @returns 
   */
   onTypeDefinitionRequest() {
    if (this.props.configMetadata.disableForFrameScripts && this.props.filename === null) {
      // If user sets disableForFrameScripts to true and this is a frame script (i.e. filename is null), don't return types
      FrayToolsPluginCore.sendTypeDefinitions([]);

      return;
    }

    // Return typedef file contents
    FrayToolsPluginCore.sendTypeDefinitions([{
      contents: 'interface IMyTypeDefinitionPluginInterface { foo:number; bar:string; }',
      filename: 'global.d.ts'
    }]);
  }

  render() {
    if (this.props.configMode) {
      // If configMode is enabled, display a different view specifically for configuring plugin metadata
      return (
        <div style={{ color: '#ffffff', background: '#000000' }}>
          <p>{JSON.stringify(MANIFEST_JSON)}</p>
          <p>Hello world! This is an example configuration view for a TypeDefinition plugin.</p>
          <p>Here you would provide a UI for assigning custom settings to persist between sessions using \'pluginConfigSyncRequest\' postMessage() commands sent to the parent window. This data will then be persisted within the current FrayTools project settings file.</p>
          <p>Below demonstrates how to persist configuration changes. Toggle the checkbox below and navigate away from the plugin view to see the change persist. When checked, observe that the types plugin is not applied to frame script after reloading the app.</p>
          <div>
            <input
              type="checkbox"
              checked={this.props.configMetadata.disableForFrameScripts}
              onChange={
                (event) => {
                  // Clone config
                  var configMetadata = {};
                  for (var key in this.props.configMetadata) {
                    if (!this.props.configMetadata.hasOwnProperty(key)) {
                      continue;
                    }
                    configMetadata[key] = this.props.configMetadata[key];
                  }
                  // Assign updated value
                  configMetadata.disableForFrameScripts = event.target.checked;
    
                  FrayToolsPluginCore.configMetadataSync(configMetadata);
                }
              }
              /> Disable for frame scripts
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
      );
    }

    // Note: TypeDefinitionPlugins that aren't in config mode run in the background and thus do not display a view while active
    return <div/>;
  }
}

// Informs FrayToolsPluginCore the default config metadata for MyTypeDefinitionPlugin when it first gets initialized
FrayToolsPluginCore.PLUGIN_CONFIG_METADATA_DEFAULTS = {
  version: MANIFEST_JSON.version,
  disableForFrameScripts: false, // Demonstrates a custom field. We use above to prevent returning the custom types while inside a frame script
};

FrayToolsPluginCore.migrationHandler = (configMetadata) => {
  // Compare configMetadata.version here with your latest manifest version and perform any necessary migrations for compatibility
};
FrayToolsPluginCore.setupHandler = (props) => {
  // Create a new container for the plugin
  var appContainer = document.createElement('div');
  appContainer.className = 'MyTypeDefinitionPluginWrapper';
  document.body.appendChild(appContainer);

  // Load the component with its props into the document body
  ReactDOM.render(<MyTypeDefinitionPlugin {...props}/>, appContainer);
};
