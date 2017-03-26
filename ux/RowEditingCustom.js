Ext.define('Ext.grid.plugin.RowEditingCustom', {
    extend: 'Ext.grid.plugin.RowEditing',
    alias: 'plugin.roweditingCustom',

    /**
     * Property
     * It hides the default action buttons
     * default: true
     */
    hiddenButtons: true,

    /**
     * Property:
     * It adds a button in a extra action column into grid.
     * 
     * Accepts: boolean (true show | false hide)| button object (not implemented yet)
     * Default: true
     */
    saveButton: true,

    /**
     * Save button icon class
     * 
     * Accepts: string
     * default: 'x-fa fa-check'
     */
    saveButtonIconCls: 'x-fa fa-check',

    /**
     * Save button tool tip
     * 
     * Accepts: string
     * default: 'Save the edited line'
     */
    saveButtonToolTip: 'Save the edited line',

    /**
     * Property:
     * It adds a button in a extra action column into grid.
     * 
     * Accepts: boolean (true show | false hide)| button object (not implemented yet)
     * Default: true
     */
    cancelButton: true,

    /**
     * Cancel button icon class
     * 
     * Accepts: string
     * default: 'x-fa fa-times'
     */
    cancelButtonIconCls: 'x-fa fa-times',

    /**
     * Cancel button tool tip
     * 
     * Accepts: string
     * default: 'Cancel'
     */
    cancelButtonToolTip: 'Cancel',

    /**
     * A list of columns ids to hide on edit.
     * 
     * Accepts: list string (itemId)
     * default: []
     */
    hiddenColumnsOnEdit: [],

    /**
     * Sets extra buttons on action column
     * 
     * Accepts: list of objects
     * default: empty list
     */
    extraButtons: [],

    /**
     * Stores the extra columns to hide and show it on events.
     */
    extraColumns: [],

    /**
     * Configure everything
     */
    initEditorConfig: function () {

        /*
         *  Adds the extra action columns
         */
        this.addExtraColumns();

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

        /*
         *  Custom configuration.
         */
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
        this.setExtraColumnsVisible(false);
        this.callSuper();
    },

    /**
     * Save edit. Sets the extra columns to false.
     */
    completeEdit: function () {
        this.setExtraColumnsVisible(false);
        this.callSuper();
    },

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
     * @param {*} isVisible 
     */
    setExtraColumnsVisible(isVisible) {
        var me = this,
            grid = me.grid;

        me.extraColumns.forEach(function (element) {
            element.setVisible(isVisible);
        });

        if (me.hiddenColumnsOnEdit) {
            me.hiddenColumnsOnEdit.forEach(function (columnItemId) {
                var column = grid.down('[itemId=' + columnItemId + ']');
                console.log(column);
                if (column) {
                    column.setVisible(!isVisible);
                }
            });
        }
    },

    /**
     * Add the extra action column
     */
    addExtraColumns() {
        var me = this,
            grid = me.grid;


        /*
        Defines the cancel button
        */
        if (me.cancelButton) {

            if (me.cancelButton === true) {
                me.cancelButton = {
                    iconCls: me.cancelButtonIconCls,
                    xtype: 'button',
                    editor: true,
                    tooltip: me.cancelButtonToolTip,
                    handler: function (grid, rowIndex, colIndex) {
                        me.cancelEdit();
                    }
                };
            }

            me.extraButtons.push(me.cancelButton);
        }

        /*
        Defines the saveButton
        */
        if (me.saveButton) {

            if (me.saveButton === true) {
                me.saveButton = {
                    iconCls: me.saveButtonIconCls,
                    xtype: 'button',
                    tooltip: me.saveButtonToolTip,
                    handler: function (grid, rowIndex, colIndex) {
                        me.completeEdit();
                    }
                };
            }

            me.extraButtons.push(me.saveButton);
        }

        /**
         * Adds the extra columns
         */
        if (me.extraButtons) {
            for (index in me.extraButtons) {
                var column = {
                    xtype: 'actioncolumn',
                    width: 30,
                    align: 'center',
                    editor: me.extraButtons[index],
                    menuDisabled: true,
                    sortable: false,
                    border: false,
                    resizable: false,
                    hideable: false,
                    menuDisabled: true
                };

                me.extraColumns.push(grid.headerCt.insert(grid.columns.length, column));
            }
        }
    }
});