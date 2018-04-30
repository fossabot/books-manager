import '../js/core.js';
import '../scss/dashboard.scss';

import Vue from 'vue';
import Datatable from 'vue2-datatable-component';

const _token = document.head.querySelector('meta[name="csrf-token"]').content;

Vue.use(Datatable);
const table = new Vue({
    el: '#table',
    template: `
        <div class="panel panel-default">
            <div class="panel-body">
                <datatable v-bind="$data">
                    <button class="btn btn-primary" :class="{ 'disabled': selection.length != 1 }" @click="edit">編集</button>
                    <button class="btn btn-danger" :class="{ 'disabled': !selection.length }" @click="remove">削除</button>
                </datatable>
            </div>
        </div>
    `,
    data: () => ({
        columns: [
            { 'title': 'タイトル', field: 'title', sortable: true },
            { 'title': '巻号', field: 'volume' },
            { 'title': '著作等', field: 'authors', sortable: true },
            { 'title': '出版日', field: 'published_date', sortable: true },
        ],
        data: [],
        total: 0,
        selection: [],
        query: {},
    }),
    watch: {
        query: {
            handler() {
                this.fetch();
            },
        },
    },
    methods: {
        fetch: function () {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/list.json');
            xhr.responseType = 'json';
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.addEventListener('load', event => {
                const result = event.target.response;

                this.data = result;
                this.total = result.length;
            });
            xhr.send();
        },
        edit: function () {
        },
        remove: function () {
            const xhr = new XMLHttpRequest();
            const ids = [];
            for (let e of this.selection) ids.push(e.id);

            xhr.open('POST', '/delete');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('X-CSRF-TOKEN', _token);
            xhr.addEventListener('load', event => {
                if (event.target.status == 204) {
                    for (let id of ids) {
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].id == id) this.data.splice(i, 1);
                        }
                    }
                    this.total = this.data.length;
                }
            });
            xhr.send(JSON.stringify({ ids: ids }));
        },
    },
});

new Vue({
    el: '#register',
    template: `
        <div class="form-inline" id="register">
            <input class="form-control" type="text" placeholder="ISBN or JP番号" v-model="code">
            <button class="btn btn-info" @click="create">登録</button>
            <button class="btn btn-success">読み取る</button>
        </div>
    `,
    data: {
        code: '',
    },
    methods: {
        create: function () {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/create');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('X-CSRF-TOKEN', _token);
            xhr.addEventListener('load', event => {
                if (event.target.status == 200) {
                    table.fetch();
                    this.code = '';
                }
            });
            xhr.send(JSON.stringify({ code: this.code }));
        },
    },
});
