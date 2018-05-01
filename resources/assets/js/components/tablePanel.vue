<template>
    <div id="content">
        <div class="panel panel-default">
            <div class="panel-body">
                <datatable v-bind="$data">
                    <button class="btn btn-primary" data-toggle="modal" data-target="#edit-modal" :disabled="selection.length != 1" @click="edit">編集</button>
                    <button class="btn btn-danger" :disabled="selection.length == 0" @click="remove">削除</button>
                </datatable>
            </div>
        </div>
        <div id="modal">
            <editModal ref="editModal" :columns="columns" :selection="selection" />
        </div>
    </div>
</template>

<script>
import editModal from './editModal.vue';

export default {
    components: { editModal },
    data: () => ({
        columns: [
            {
                title: 'タイトル',
                field: 'title',
                sortable: true,
                type: 'text',
                required: true,
            },
            {
                title: '巻号',
                field: 'volume',
                type: 'text',
                required: false,
            },
            {
                title: '著作等',
                field: 'authors',
                sortable: true,
                type: 'text',
                required: true,
            },
            {
                title: '出版日',
                field: 'published_date',
                sortable: true,
                type: 'date',
                required: true,
            },
        ],
        data: [],
        total: 0,
        selection: [],
        query: {},
    }),
    methods: {
        fetch(query) {
            const xhr = new XMLHttpRequest();
            let url = '/list.json?';
            Object.keys(query).map(k => url += k + '=' + query[k] + '&');

            xhr.open('GET', url.substring(url.length - 1, -1));
            xhr.responseType = 'json';
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.addEventListener('load', event => {
                if (event.target.status == 200) {
                    const result = event.target.response;

                    this.data = result.data;
                    this.total = result.total;
                }
            });
            xhr.send();
        },
        create(entry) {
            this.data.push(entry);
            this.total++;
        },
        edit() {
            this.$refs.editModal.open();
        },
        remove() {
            const xhr = new XMLHttpRequest();
            const ids = [];
            this.selection.map(e => ids.push(e.id));

            xhr.open('POST', '/delete');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('X-CSRF-TOKEN', document.head.querySelector('meta[name="csrf-token"]').content);
            xhr.addEventListener('load', event => {
                if (event.target.status == 204) {
                    ids.map(id => {
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].id == id) this.data.splice(i, 1);
                        }
                    });
                    this.total = this.data.length;
                }
            });
            xhr.send(JSON.stringify({ ids: ids }));
        },
    },
    watch: {
        query: {
            handler(query) {
                this.fetch(query);
            },
            deep: true,
        },
    },
}
</script>