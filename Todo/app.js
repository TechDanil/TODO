const tasks = [];

(function(items){
    const itemContainer = document.querySelector('.tasks-list-section .list-group');
    const form = document.forms['addTask'];

    const titleInput = form.elements['title'];
    const bodyInput =  form.elements['body'];

    form.addEventListener('submit', onFormSubmitHandler);

    itemContainer.addEventListener('click', onDeleteItemHandler);

    itemContainer.addEventListener('click', onEditItemFrameHandler);

    itemContainer.addEventListener('click', onSavedEditItemHandler);

    itemContainer.addEventListener('click', onCanceledEditItemHandler);


    function genereteItemHTML(item) {
        const {_id, title, body} = item;

        const renderedItem = document.createElement('li');
        renderedItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2', 'item_show');
        renderedItem.setAttribute('data-item-id', _id);

        const itemTitle = document.createElement('span');
        itemTitle.textContent = title;

        const divider = document.createElement('hr');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'edit-btn');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger', 'mr-auto', 'delete-btn');
        
        const article = document.createElement('p');
        article.textContent = body;
        article.classList.add('mt-2', 'w-100');

        const renderedItems = [];
        renderedItems.push(itemTitle, divider ,article, deleteBtn, editBtn);

        for (let i = 0; i < renderedItems.length; i++) {
          renderedItem.appendChild(renderedItems[i]);
        }
        

        return renderedItem;
    }
    

    function generateItem(title, body) {
        const newItem = {
          title,
          body,
          _id: `Item-${Math.random()}`,
        };
        items[newItem._id] = newItem;
        console.log(items)

        return {...newItem};
    }

    function renderHTMLItem() {
      const fragment = document.createDocumentFragment();
      const titleValue = titleInput.value;
      const bodyValue = bodyInput.value;

      if(!titleValue || !bodyValue){
        alert('pls enter title or body!');
        return;
      }
      
      const generetedItem = generateItem(titleValue, bodyValue);
      const rendertedItem = genereteItemHTML(generetedItem);
      fragment.appendChild(rendertedItem);
      itemContainer.appendChild(fragment);
      itemContainer.insertAdjacentElement('afterbegin', rendertedItem);
    }

    function onFormSubmitHandler(e) {
        e.preventDefault();
        renderHTMLItem();
        form.reset();
    }

    function onDeleteItemHandler(e) {
      const {target} = e;

      if(target.classList.contains('delete-btn')){
        const parent = target.closest('[data-item-id]');

        const itemId = parent.dataset.itemId;
        removeItem(parent, itemId);
      }
    }

    function removeItem(item, itemId) {
      const { title } =  items[itemId];
      const isConfirmed = confirm(`Are you sure that you want to delete ${title}?`);

      if(!isConfirmed)
        return isConfirmed;
      
      item.remove();
      delete items[itemId];

      return isConfirmed;
    }
 
    function onEditItemFrameHandler(e) {
      const {target} = e;

      if(target.classList.contains('edit-btn')){
        const parent = target.closest('[data-item-id]');
        const itemId = parent.dataset.itemId;
        showEditFrameItem(parent, itemId);
      }
    }

    function editItem(item, itemId) {
      const { title } = items[itemId]
      const isConfirmed = confirm(`Are you sure that you want to edit ${title}?`);

      if(!isConfirmed)
        return isConfirmed;


      return isConfirmed;
    }

    function onSavedEditItemHandler(e) {
      const { target } = e;

      if(target.classList.contains('save-btn')){
        console.log(target)
        const parent = target.closest('[data-item-id]');
        const itemId = parent.dataset.itemId;
        changeInputValue(itemId);
      }
    }

    function onCanceledEditItemHandler(e) {
      const { target } = e;

      if (target.classList.contains('cancel-btn')){
        console.log(target)
        const parent = target.closest('[data-item-id]').previousElementSibling;
        // const itemId = parent.dataset.itemId;

        const isConfirmed = confirm();
        cancleEditFrameItem(parent, isConfirmed)
        console.log(parent)
      }
    }

    function getBackToPreviousItemFrame(item) {
      item.setAttribute('style', 'display: flex !important');
    }

    function changeInputValue(itemId) {
        const { title} = item;
        console.log(title);
    }


    function cancleEditFrameItem(item, isConfirmed) {
        if (isConfirmed){
          item.nextElementSibling.setAttribute('style', 'display: none !important');
          console.log(item)
          getBackToPreviousItemFrame(item);
        }

        return;
    }

    function showEditFrameItem(item, itemId) {
      const { title } = items[itemId];

      const isConfirmed = confirm(`Are you sure that you want to edit ${title}?`);

      if(!isConfirmed)
        return isConfirmed;
      
      item.setAttribute('style', 'display: none !important');
      renderEditFrameHtml(itemId);
      return isConfirmed;
    }

    function renderEditFrameHtml(itemId) {
      const {_id } = items[itemId]; 

      const itemEdited = document.createElement('li');
      itemEdited.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2', 'edit_item');
      itemEdited.setAttribute('data-item-id', items[_id]._id);

      console.log(itemEdited.getAttribute('data-item-id'));
      const newTitleInput = genereteEditInput('input', ['form-control'], [['type', 'text'],
      ['name', 'title'], ['id', 'title'], ['placeholder', 'new task title']]);

      const newBodyInput = genereteEditInput('input', ['form-control', 'mt-3'], [['type', 'text'],
      ['name', 'body'], ['id', 'body'], ['placeholder', 'new task body']]);
      
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.classList.add('btn', 'btn-danger', 'mr-auto', 'mt-3','save-btn');

      const canceBtn = document.createElement('button');
      canceBtn.textContent = 'Cancel';
      canceBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'mt-3','cancel-btn');

      const renderedItems = [];
      renderedItems.push(newTitleInput, newBodyInput, saveBtn, canceBtn);

      for (let i = 0; i < renderedItems.length; i++) {
        itemEdited.appendChild(renderedItems[i]);
      }
      
      itemContainer.appendChild(itemEdited);
      return itemEdited;
    }

    function genereteEditInput(input, classNames, atributes) {
      const generatedInput = document.createElement(input);
      generatedInput.classList.add(...classNames);
      atributes.forEach(([key, value]) => generatedInput.setAttribute(key, value));
      return generatedInput;
    }

    
})(tasks);