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
     * Property:
     * It adds a button in a extra action column into grid.
     * 
     * Accepts: boolean (true show | false hide)| button object (not implemented yet)
     * Default: true
     */
    cancelButton: true,

    /**
     * Hides a column on edit
     * 
     * Accepts: string (itemId)
     * default: null
     */
    columnHiddenOnEdit: null,

    /**
     * Sets extra buttons on action column
     * 
     * Accepts: list of objects
     * default: empty list
     */
    extraButtons: [],

    /**
     * Configure everything
     */
    initEditorConfig: function () {

        /*
         *  Adds the extra action column
         */
        this.addExtraColumn();

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
                // keep a reference.. 
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

    listeners: {
        beforeedit: function (grid, e, eOpts) {
            return e.column.xtype !== 'actioncolumn';
        }
    },

    /**
     * Add the extra action column
     */
    addExtraColumn() {
        var me = this,
            grid = me.grid;

        if (me.cancelButton) {

            if (me.cancelButton === true) {
                me.cancelButton = {
                    iconCls: 'x-fa fa-times',
                    xtype: 'button',
                    editor: true,
                    tooltip: 'Cancel',
                    handler: function (grid, rowIndex, colIndex) {
                        alert('todo!!!');
                    }
                };
            }

            me.extraButtons.push(me.cancelButton);
        }

        if (me.saveButton) {

            if (me.saveButton === true) {
                me.saveButton = {
                    iconCls: 'x-fa fa-check',
                    xtype: 'button',
                    tooltip: 'Save the edited line',
                    handler: function (grid, rowIndex, colIndex) {
                        alert('todo!!!');
                    }
                };
            }

            me.extraButtons.push(me.saveButton);
        }

        if (me.extraButtons) {
            for (index in me.extraButtons) {
                grid.headerCt.insert(grid.columns.length, {
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
                });
            }
        }
    }
});