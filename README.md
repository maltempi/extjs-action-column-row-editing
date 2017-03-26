# Action Column Row Editing - An custom ExtJS Plugin
An ExtJS plugin based on Ext.grid.plugin.RowEditing changing the default floating buttons to an action column.

## General Info
This is a custom plugin created as a alternative to default usability provided by Ext.grid.plugin.RowEditing and it is also a workarround to this issue: https://www.sencha.com/forum/showthread.php?337303-Buttons-(Save-and-Cancel)-are-overlapped-by-grid-on-rowediting-plugin

* Demo website: https://maltempi.github.io/extjs-action-column-row-editing/demo/
* Issues: https://github.com/maltempi/extjs-action-column-row-editing/issues
* License: https://github.com/maltempi/extjs-action-column-row-editing/blob/master/LICENSE 
* General rules: Fell free to sugest new ideas, fork this and so on :-)
* Required Version: ExtJS 6.2.0 (actually it wasn't tested on others versions)

## Properties

### hiddenButtons
It hides the default action buttons
If it is false, it will work as the default Ext.grid.plugin.RowEditing.
* Defaults to: true

### buttonsUi
The action buttons ui
* Defaults to: 'default'

### saveButton
It adds a button in a extra action column into grid.
* Accepts: boolean (true show | false hide)| button object (not implemented yet)
* Defaults to: true

### saveButtonIconCls
Save button icon class
* Accepts: string
* Defaults to: 'x-fa fa-check'

### saveButtonToolTip
Save button tool tip
* Accepts: string
* Defaults to: 'Save the edited line'


### cancelButton
It adds a button in a extra action column into grid.
* Accepts: boolean (true show | false hide)| button object (not implemented yet)
* Defaults to: true

### cancelButtonIconCls
The cancel button icon class
* Accepts: string
* Defaults to: 'x-fa fa-times'


### cancelButtonToolTip
* Accepts: string
* Defaults to: 'Cancel'

### hiddenColumnsOnEdit
A list of columns ids to hide on edit.
* Accepts: list string (itemId)
* Defaults to: empty list []

### extraButtons
Sets extra buttons on action column
* Accepts: list of objects
* Defaults to: empty list []

### extraColumns
* Stores the extra columns to hide and show it on events. 
* Defaults to: empty list []
