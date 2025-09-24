import dayjs from 'dayjs';
import _ from 'lodash';

export default {
    filesFormatter(arr) {
        if (!arr || !arr.length) return [];
        return arr.map((item) => item);
    },
    imageFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            publicUrl: item.publicUrl || ''
        }))
    },
    oneImageFormatter(arr) {
        if (!arr || !arr.length) return ''
        return arr[0].publicUrl || ''
    },
    dateFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD')
    },
    dateTimeFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    booleanFormatter(val) {
        return val ? 'Yes' : 'No'
    },
    dataGridEditFormatter(obj) {
        return _.transform(obj, (result, value, key) => {
            if (_.isArray(value)) {
                result[key] = _.map(value, 'id');
            } else if (_.isObject(value)) {
                result[key] = value.id;
            } else {
                result[key] = value;
            }
        });
    },

        campaignsManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.title)
        },
        campaignsOneListFormatter(val) {
            if (!val) return ''
            return val.title
        },
        campaignsManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.title}
            });
        },
        campaignsOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.title, id: val.id}
        },

        eventsManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.name)
        },
        eventsOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        eventsManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        eventsOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

}
