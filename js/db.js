import { openDB } from "idb";

let db;

async function createDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch (oldVersion) {
                    case 0:
                    case 1: 
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        showResult("banco de dados criado!");
                }
            }
        });
        showResult("banco de dados aberto.");
    } catch (e){
        showResult("erro ao criar banco de dados" + e.message)
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();
    document.getElementById("nome");
    document.getElementById("idade");
    document.getElementById("salvar").addEventListener("click", addData);
    document.getElementById("listar").addEventListener("click", getData);
});

async function getData(){
    if(db == undefined) {
        showResult("o banco de dados esta fechado");
        return;
    }

    const tx = await db.transaction('pessoas', 'readonly')
    const store = tx.objectStore('pessoas');
    const value = await store.getAll();
    if(value){
        showResult("dados do banco:" + JSON.stringify(value))
    } else{
        showResult("não há nenhum dado no banco.")
    }
}

async function addData(){
    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.add({ nome: 'fulano' });
    await tx.done;
}

function showResult(text){
    document.querySelector("output").innerHTML = text;
}