/**
 * This is a custom plugin created as a alternative to default usability provided by Ext.grid.plugin.RowEditing and it is also a 
 * workarround to this issue:
 * https://www.sencha.com/forum/showthread.php?337303-Buttons-(Save-and-Cancel)-are-overlapped-by-grid-on-rowediting-plugin
 * 
 * Repository: https://github.com/maltempi/extjs-action-column-row-editing
 * Demo website: https://maltempi.github.io/extjs-action-column-row-editing/demo/
 * Issues: https://github.com/maltempi/extjs-action-column-row-editing/issues
 * License: https://github.com/maltempi/extjs-action-column-row-editing/blob/master/LICENSE
 * 
 * Base code:
 *   http://docs.sencha.com/extjs/6.2.0/classic/src/RowEditor.js.html#Ext.grid.RowEditor
 *   http://docs.sencha.com/extjs/6.2.0/classic/src/RowEditing.js.html#Ext.grid.plugin.RowEditing
 *
 * General rules: Feel free to suggest new ideas, fork it and so on :)
 * 
 * Required Version: ExtJS 6.2.0 (actually it wasn't tested on others versions)
 */
Ext.define('Ext.grid.plugin.ActionColumnRowEditing', {
    extend: 'Ext.grid.plugin.RowEditing',
    alias: 'plugin.actionColumnRowEditing',

    /**
     * Property
     * It hides the default action buttons
     * If it is false, it will work as the default Ext.grid.plugin.RowEditing.
     * 
     * Defaults to: true
     */
    hiddenButtons: true,

    /**
     * Property
     * The button ui
     * 
     * Defaults to: 'default'
     */
    buttonsUi: 'default',

    /**
     * Property
     * It adds a button in a extra action column into grid.
     * 
     * Accepts: boolean (true show | false hide)| button object (not implemented yet)
     * Defaults to: true
     */
    saveButton: true,

    /**
     * Save button icon class
     * 
     * Accepts: string
     * Defaults to: 'x-fa fa-check'
     */
    saveButtonIconCls: 'x-fa fa-check',

    /**
     * Save button tool tip
     * 
     * Accepts: string
     * Defaults to: 'Save the edited line'
     */
    saveButtonToolTip: 'Save the edited line',

    /**
     * Property:
     * It adds a button in a extra action column into grid.
     * 
     * Accepts: boolean (true show | false hide)| button object (not implemented yet)
     * Defaults to: true
     */
    cancelButton: true,

    /**
     * Cancel button icon class
     * 
     * Accepts: string
     * Defaults to: 'x-fa fa-times'
     */
    cancelButtonIconCls: 'x-fa fa-times',

    /**
     * Cancel button tool tip
     * 
     * Accepts: string
     * Defaults to: 'Cancel'
     */
    cancelButtonToolTip: 'Cancel',

    /**
     * A list of columns ids to hide on edit.
     * 
     * Accepts: list string (itemId)
     * Defaults to: empty list []
     */
    hiddenColumnsOnEdit: [],

    /**
     * Sets extra buttons on action column
     * 
     * Accepts: list of objects
     * Defaults to: empty list []
     */
    extraButtons: [],

    /**
     * Stores the extra columns to hide and show it on events.
     * 
     * Defaults to: empty list []
     */
    extraColumns: [],

    /**
     * Configure everything
     */
    initEditorConfig: function () {

        // Clear info 
        this.extraButtons = [];
        this.extraColumns = [];

        var me = this,
            grid = me.grid,
            view = me.view,
            headerCt = grid.headerCt,
            btns = ['saveBtnText', 'cancelBtnText', 'errorsText', 'dirtyText'],
            b,

            bLen = btns.length,
            cfg = {
                autoCancel: me.autoCancel,
                autoUpdate: me.autoUpdate,
                removeUnmodified: me.removeUnmodified,
                errorSummary: me.errorSummary,
                formAriaLabel: me.formAriaLabel,
                formAriaLabelRowBase: me.formAriaLabelRowBase + (grid.hideHeaders ? -1 : 0),
                fields: headerCt.getGridColumns(),
                hidden: true,
                view: view,
                updateButton: function (valid) { },
                editingPlugin: me
            },
            item;

        // Custom configuration.
        if (me.hiddenButtons) {
            cfg.getFloatingButtons = function () {
                var me = this,
                    btns = me.floatingButtons;

                if (!btns && !me.destroying && !me.destroyed) {
                    me.floatingButtons = btns = Ext.create('Ext.container.Container', {
                        hidden: true,
                        setButtonPosition: function () { },
                    });
                }

                return btns;
            };
        } else {
            for (b = 0; b < bLen; b++) {
                item = btns[b];

                if (Ext.isDefined(me[item])) {
                    cfg[item] = me[item];
                }
            }
        }

        return cfg;
    },

    /**
     * Cancel edit. Sets the extra columns to false.
     */
    cancelEdit: function () {
        this.callSuper();
        this.setExtraColumnsVisible(false);
    },

    /**
     * Save edit. Sets the extra columns to false.
     */
    completeEdit: function () {
        if (!this.editor.form.isValid()) {
            return false;
        }
        this.callSuper();
        this.setExtraColumnsVisible(false);
    },

    ok: false,

    /**
     * Starts editing the specified record, using the specified Column definition to define which field is being edited.
     * @param {Ext.data.Model} record The Store data record which backs the row to be edited.
     * @param {Ext.grid.column.Column/Number} [columnHeader] The Column object defining the column field to be focused, or index of the column.
     * If not specified, it will default to the first visible column.
     * @return {Boolean} `true` if editing was started, `false` otherwise.
     */
    startEdit: function (record, columnHeader) {

        var me = this,
            editor = me.getEditor(),
            grid = me.grid,
            context;

        if (me.extraColumns.length === 0) {
            me.addExtraColumns();
        }

        if (Ext.isEmpty(columnHeader)) {
            columnHeader = me.grid.getTopLevelVisibleColumnManager().getHeaderAtIndex(0);
        }

        if (editor.beforeEdit() !== false) {
            context = me.getEditingContext(record, columnHeader);
            if (context && me.beforeEdit(context) !== false && me.fireEvent('beforeedit', me, context) !== false && !context.cancel) {
                me.context = context;

                // If editing one side of a lockable grid, cancel any edit on the other side. 
                if (me.lockingPartner) {
                    me.lockingPartner.cancelEdit();
                }
                editor.startEdit(context.record, context.column, context);
                me.editing = true;

                this.setExtraColumnsVisible(true);

                return true;
            }
        }

        return false;
    },

    /**
     * Hides or shows the extra action columns in the grid.
     * It is used on startEdit(), cancelEdit() and completeEdit() methods.
     * @param {Boolean} isVisible 
     */
    setExtraColumnsVisible: function (isVisible) {
        var me = this,
            grid = me.grid;

        me.extraColumns.forEach(function (element) {
            element.setVisible(isVisible);
        });

        if (me.hiddenColumnsOnEdit) {
            me.hiddenColumnsOnEdit.forEach(function (columnItemId) {
                var column = grid.down('[itemId=' + columnItemId + ']');
                if (column) {
                    column.setVisible(!isVisible);
                }
            });
        }
    },

    /**
     * Add the extra action column
     */
    addExtraColumns: function () {
        var me = this,
            grid = me.grid;

        // Defines the cancel button
        if (me.cancelButton) {

            if (me.cancelButton === true) {
                me.cancelButton = {
                    iconCls: me.cancelButtonIconCls,
                    xtype: 'button',
                    ui: me.buttonsUi,
                    maxWidth: 30,
                    tooltip: me.cancelButtonToolTip,
                    handler: function (grid, rowIndex, colIndex) {
                        me.cancelEdit();
                    }
                };
            }

            me.extraButtons.push(me.cancelButton);
        }

        // Defines the saveButton
        if (me.saveButton) {

            if (me.saveButton === true) {
                me.saveButton = {
                    iconCls: me.saveButtonIconCls,
                    xtype: 'button',
                    maxWidth: 30,
                    ui: me.buttonsUi,
                    tooltip: me.saveButtonToolTip,
                    handler: function (grid, rowIndex, colIndex) {
                        me.completeEdit();
                    }
                };
            }

            me.extraButtons.push(me.saveButton);
        }

        // Adds the extra columns
        if (me.extraButtons) {
            for (index in me.extraButtons) {
                var column = {
                    xtype: 'actioncolumn',
                    maxWidth: 30,
                    align: 'center',
                    editor: me.extraButtons[index],
                    menuDisabled: true,
                    sortable: false,
                    border: false,
                    resizable: false,
                    hideable: false,
                };

                me.extraColumns.push(grid.headerCt.insert(grid.columns.length, column));
            }
        }
    }
});