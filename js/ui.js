const contacts = document.querySelector('.contacts');

document.addEventListener('DOMContentLoaded', function () {
    var sidenav = document.querySelectorAll('.sidenav');
    var modal = document.querySelectorAll('.modal');
    var fab = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(fab);
    M.Sidenav.init(sidenav);
    M.Modal.init(modal);
});

const renderContact = (data, id) => {
    const html = `
    <li class="collection-item contact avatar" data-id="${id}">
        <i class="material-icons circle red">contacts</i>
        <p>Name : <span class="name">${data.name}</span></p>
        <p>Phone : <span class="phone">${data.phone}</span></p>
        <div href="#!" class="secondary-content" data-id="${id}" style="text-align: right;">
            <i class="material-icons modal-trigger" style="cursor: pointer;" href="#edit_contact_modal">edit</i>
            <i class="material-icons" style="cursor: pointer;">${data.favorite ? 'star' : 'star_border'}</i>
            <i class="material-icons" style="cursor: pointer;">delete_outline</i>
        </div>
    </li>`;
    contacts.innerHTML += html
}

const removeContact = (id) => {
    const contact = document.querySelector(`.contact[data-id="${id}"]`);
    console.log(contact);
    contact.remove();
}

const updateContact = (data, id) => {
    const contact = document.querySelector(`.contact[data-id="${id}"]`);
    contact.querySelector('.name').innerHTML = data.name;
    contact.querySelector('.phone').innerHTML = data.phone;
    contact.querySelectorAll('.material-icons')[2].textContent = data.favorite ? 'star' : 'star_border';
}