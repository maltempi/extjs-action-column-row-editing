Ext.define('Ext.grid.plugin.RowEditingCustom', {
    extend: 'Ext.grid.plugin.RowEditing',
    alias: 'plugin.roweditingCustom',

    initEditor: function () {
        return new Ext.grid.RowEditor(this.initEditorConfig());
    },

    hideButtons: true,

    initEditorConfig: function () {
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
                updateButton: function (valid) { },
                view: view,
                editingPlugin: me
            },
            item;

        /*
            Custom configuration.
        */
        if (me.hideButtons) {
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
    }
});