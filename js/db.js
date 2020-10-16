db.enablePersistence().catch(err => {
    if (err.code === 'failed-precondition') {
        console.log('multiple tabs opened')
    } else if (err.code === 'unimplemented') {
        console.log('browser not support')
    }
})

const contactForm = document.querySelector('.add-contact form');
const addContactModal = document.querySelector('#add_contact_modal');
const editForm = document.querySelector('.edit-contact form');
const editContactModal = document.querySelector('#edit_contact_modal');
let updateId = null;

contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const contact = {
        name: contactForm.name.value,
        phone: contactForm.phone.value,
        favorite: false
    }
    db.collection('contacts').add(contact).then(() => {
        contactForm.reset();
        var instance = M.Modal.getInstance(addContactModal);
        instance.close();
        contactForm.querySelector('.error').textContent = '';
    }).catch(err => {
        contactForm.querySelector('.error').textContent = err.message;
    })
})

editForm.addEventListener('submit', e => {
    e.preventDefault();
    const contact = {
        name: editForm.name.value,
        phone: editForm.phone.value
    }
    db.collection('contacts').doc(updateId).update(contact).then(() => {
        editForm.reset();
        var instance = M.Modal.getInstance(editContactModal);
        instance.close();
        editForm.querySelector('.error').textContent = '';
    }).catch(err => {
        editForm.querySelector('.error').textContent = err.message;
    })
})

db.collection('contacts').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            console.log(`${change.doc.id} is added`);
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                renderContact(change.doc.data(), change.doc.id);
            } else if (window.location.pathname === '/pages/favorites.html') {
                if (change.doc.data().favorite) {
                    renderContact(change.doc.data(), change.doc.id);
                }
            }
        } else if (change.type === 'removed') {
            console.log(`${change.doc.id} is removed`);
            removeContact(change.doc.id);
        } else if (change.type === 'modified') {
            console.log(`${change.doc.id} is modified`);
            updateContact(change.doc.data(), change.doc.id);
        }
    })
})

const contactContainer = document.querySelector('.contacts');
contactContainer.addEventListener('click', e => {
    console.log('e.target.textContent', e.target.textContent);
    if (e.target.textContent === 'delete_outline') {
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('contacts').doc(id).delete();
    } else if (e.target.textContent === 'edit') {
        updateId = e.target.parentElement.getAttribute('data-id');
        const contact = document.querySelector(`.contact[data-id=${updateId}]`);
        const name = contact.querySelector('.name').innerHTML;
        const phone = contact.querySelector('.phone').innerHTML;
        editForm.name.value = name;
        editForm.phone.value = phone;
    } else if (e.target.textContent === 'star_border') {
        const id = e.target.parentElement.getAttribute('data-id');
        contact = { favorite: true }
        db.collection('contacts').doc(id).update(contact);
    } else if (e.target.textContent === 'star') {
        const id = e.target.parentElement.getAttribute('data-id');
        contact = { favorite: false }
        db.collection('contacts').doc(id).update(contact);
    }
})