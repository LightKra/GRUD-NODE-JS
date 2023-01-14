window.addEventListener("DOMContentLoaded", e =>{
    updateTodos();
});
const mapCheckboxes = ()=>{
    document.querySelectorAll(".complete-checkbox").forEach(item=>{
        item.addEventListener("click", async e=>{
            const id = e.target.parentNode.parentNode.id;
            e.target.parentNode.parentNode.childNodes[1].className.replace("completed",'').trim();
            const completed = e.target.checked;
            const res = await updateTodo(id, completed);
            if(res.response==="success"){
                if(completed){
                    e.target.parentNode.parentNode.childNodes[1].className="text-container completed";
                }else{
                    e.target.parentNode.parentNode.childNodes[1].className="text-container";
                }
            }
        })
    })
}
const updateTodo = async (id, completed)=>{
    const res = await fetch("/complete/"+id+"/"+(completed ? "true" : "false"))
    .then(response => response.json());
    return res;
}
const deleteNodes = ()=>{
    const fatherNode = document.querySelector("#todos");
    while(fatherNode.firstChild){
        fatherNode.removeChild(fatherNode.firstChild);
    }
}
const updateTodos = ()=>{
    deleteNodes();
    fetch("/getall",{method: "GET"})
    .then(response => response.json())
    .then(data=>{
         data.forEach(todo=>{
            document.querySelector('#todos').innerHTML+=`
            <div class="todo" id="${todo._id}"><div class="checkbox-container"><input type="checkbox" class="complete-checkbox" ${(todo.completed === true) ? 'checked' : ''}/></div><div class="text-container ${(todo.completed === true) ? 'completed' : ''}">${todo.text}</div><div class="actions-container"><a href="/delete/${todo._id}">X</a></div></div>`
         })
         mapCheckboxes(); 
    }).catch(err=> console.error(err));
}
document.querySelector("#formulario").addEventListener("submit", e=>{
    e.preventDefault();
    const text = document.querySelector("#text").value;
    if(text==='') return false;
    fetch("/add",{
        method: "POST",
        body: JSON.stringify({text: text}),
        headers: {"content-type": "application/json"}
    }).then(response=>response.json())
    .then(data=>{
        if(data.response === "success"){
            updateTodos();
            document.querySelector("#text").value = "";
        }
    })
})