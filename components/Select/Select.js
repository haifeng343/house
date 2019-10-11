// components/houseStat/houseStat.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: {
            type: Number
        },
        optionList: {
            type: Array
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        expand: false,
        label: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        calcLabel(value) {
            const { optionList } = this.properties;
            if (this.properties.optionList.length === 0) {
                return;
            }

            let label = optionList[0].label;

            if (value !== undefined) {
                const selectedItem = optionList.find(item => item.value === value);

                if (selectedItem) {
                    label = selectedItem.label;
                }
            }

            return label;
        },
        handleExpand() {
            const { onExpand } = this.properties;
            if (typeof onExpand === 'function') {
                onExpand(!this.data.expand);
            }
            this.setData({ expand: !this.data.expand });
        },
        handleChange(event) {
            let value = event.currentTarget.dataset.item.value;
            let label = event.currentTarget.dataset.item.label;
            this.setData({ label })
            this.triggerEvent('change', { value: value })
        }
    },

    lifetimes: {
        ready() {
            const label = this.calcLabel(this.properties.value);
            this.setData({ label });
        }
    }
})
