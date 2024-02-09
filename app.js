window.onload = () => {
  const form = document.getElementById("editor");

  //sauvegarde des éléments dans local storage
  const saveData = (data) =>{
    if ("localStorage" in window) {
        localStorage.setItem("lists", JSON.stringify(data)) || []
    }
  }

  //réception des éléments stockés dans local storage
  const getData = () =>{
      if ("localStorage" in window) {
          return JSON.parse(localStorage.getItem("lists"))
      }else{
          return []
      }
  }

  //affichage des éléments
  const showList = () => {
    const ul = document.getElementById("list-container");
    ul.innerHTML = "";
    lists.forEach((list) => {
      const li = document.createElement("li");

      const span = document.createElement("span");

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete";
      deleteBtn.onclick = () => deleteList(list);

      const unchecked = document.createElement("i");
      unchecked.className = "fa-regular fa-circle unchecked";
      unchecked.onclick = () => {
        checked.style.display = "block";
        unchecked.style.display = "none";
        span.style.textDecoration = "line-through";
        span.style.color = "gray"
        saveData(lists)
      }

      const checked = document.createElement('i')
      checked.className = "fa-regular fa-circle-check checked";
      checked.onclick = () => {
        checked.style.display = "none"
        unchecked.style.display = "block"
        span.style.textDecoration = "none";
        span.style.color = "black"
        saveData(lists)
      }

      if (list.isUpdating) {
        const input = document.createElement("input");
        input.className = "input"
        input.value = list.name;
        input.onchange = (event) => changeUpdateList(event, list)

        const acceptBtn = document.createElement('button')
        acceptBtn.innerText = "Ok ?";
        acceptBtn.className = "accept";
        acceptBtn.onclick = () => saveUpdate(list)

        li.appendChild(input);
        li.appendChild(acceptBtn)
      } else {
        //const span = document.createElement("span");
        span.innerHTML = list.name;

        const editBtn = document.createElement("button");
        editBtn.onclick = () => updateList(list)
        editBtn.innerText = "Edit";
        editBtn.className = "update";

        li.appendChild(span);
        li.appendChild(editBtn);
      }

      li.appendChild(deleteBtn);
      li.appendChild(unchecked);
      li.appendChild(checked);
      ul.appendChild(li);
    })
  }
  let lists = getData();
  showList()

  //créer un élément
  form.onsubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const listName = input.value.trim();
    if (listName) {
      const list = {
        id: Math.round(Math.random() * 8586561),
        name: listName,
        createdAt: new Date(),
        updatedAt: null,
        isUpdating: false,
      };
      lists.push(list);
      saveData(lists)
      showList();
    }
    form.reset();
  };

  //supprimer un élément
  const deleteList = ({ id }) => {
    lists = lists.filter((list) => list.id !== id);
    saveData(lists)
    showList();
  };

  //enclencher la modification
  const updateList = (list) => {
    if (!list.isUpdating) {
        const index = lists.findIndex(l => l.id === list.id)
        lists[index].isUpdating = true
    }
    saveData(lists)
    showList()
  }

  //enregistrer l'élément modifié
  const changeUpdateList = (event ,list) => {
    const name = event.target.value.trim()
    if (name) {
      list.name = name
      list.updatedAt = new Date()
      const index = lists.findIndex(l => l.id === list.id)
      lists[index] = list
      saveData(lists)
    }

  }

  //sauvegarder la modification
  const saveUpdate = (list) => {
    if (list.isUpdating) {
      const index = lists.findIndex(l => l.id === list.id)
      lists[index].isUpdating = !list.isUpdating
    }
    saveData(lists)
    showList()
  }

};
