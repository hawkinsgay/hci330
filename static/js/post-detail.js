
let activePost;


// gets post from the server:
const getPost = () => {
    // get post id from url address:
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);

    // fetch post:
    fetch('/api/posts/' + id + '/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            activePost = data;
            renderPost();
        });
};

const getComments = () => {
    fetch('/api/comments/?post_id=' + id)
        .then(response => {
            return response.json();
        })
        .then(displayComments); // build HTML representation and inject it into the DOM
};

const displayComments = (comms) => {
    console.log(comms);
    const url = window.location.href;
    counter = 0; // to count the number of comments
    commentids=[];
    num = url.substring(url.lastIndexOf('#') + 1);
        let theHTML = '<h2>Comments</h2>';
        for (const comment of comms) {
            if (comment.post.$oid == num) {
                counter += 1;
                theHTML += `<section class="comment">
            <p><strong>Comment ${counter}:</strong> ${comment.comment}</p>
            <p></p><strong>Author:</strong> ${comment.author}</p>
            </section>`
                //buttons section - make a delte button
                theHTML += `<button class="delete-comment" id="del-com" data-comment-id=${comment._id.$oid}>Delete Comment</button><br>`
                commentids.push(comment._id.$oid);
            }
        }
        counter=1
        document.querySelector('#comments').innerHTML = theHTML

        const commentButtons = document.querySelectorAll('.delete-comment');
        for (const deleteButton of commentButtons)
        {
            //theid=deleteButton.getAttribute('data-comment-id')
            deleteButton.onclick = deleteComments2;
        }
        document.querySelector('#add-com').onclick = showaddForm; // click the add-comment button, created on html sheet
};
// opens the form for adding a new comment
const showaddForm = (ev) => {
    // get the form from the DOM and remove hide class
    console.log("click")
    document.querySelector('#comment-form').classList.remove("hide");
    document.querySelector('#save_com').onclick = createComment;
    document.querySelector('#cancel_com').onclick = renderPost;
}

const deleteComments2 = (ev) => {
    const button = ev.currentTarget;
    const commentID = button.getAttribute('data-comment-id');
    const doIt = confirm('Are you sure you want to delete this comment?');
    if (!doIt) {
        return;
    }
    fetch('/api/comments/' + commentID + '/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // navigate back to main page:
        // window.location.href = '/';
    });
    ev.preventDefault()
    window.location.reload();
};

// updates the post:
const updatePost = (ev) => {
    const data = {
        title: document.querySelector('#title').value,
        content: document.querySelector('#content').value,
        author: document.querySelector('#author').value
    };
    console.log(data);
    fetch('/api/posts/' + activePost.id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            activePost = data;
            renderPost();
            showConfirmation();
        });

    // this line overrides the default form functionality:
    ev.preventDefault();
};

const deletePost = (ev) => {
    const doIt = confirm('Are you sure you want to delete this blog post?');
    if (!doIt) {
        return;
    }
    fetch('/api/posts/' + activePost.id + '/', { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // navigate back to main page:
        //window.location.href = '/'; //**
    });
    ev.preventDefault()
    window.location.reload();
};

// creates the HTML to display the post:
const renderPost = (ev) => {
    const paragraphs = '<p>' + activePost.content.split('\n').join('</p><p>') + '</p>';
    const template = `
            <p
    } id="confirmation" class="hide"></p>
        <h1>${activePost.title}</h1>
        <div class="date">${formatDate(activePost.published)}</div>
        <div class="content">${paragraphs}</div>
        <p>
            <strong>Author: </strong>${activePost.author}
        </p>
    `;
    document.querySelector('.post').innerHTML = template;
    toggleVisibility('view');

    // prevent built-in form submission:
    if (ev) { ev.preventDefault(); }
};

// creates the HTML to display the editable form:
const renderForm = () => {
    const htmlSnippet = `
        <div class="input-section">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" value="${activePost.title}">
        </div>
        <div class="input-section">
            <label for="author">Author</label>
            <input type="text" name="author" id="author" value="${activePost.author}">
        </div>
        <div class="input-section">
            <label for="content">Content</label>
            <textarea name="content" id="content">${activePost.content}</textarea>
        </div>
        <button class="btn btn-main" id="save" type="submit">Save</button>
        <button class="btn" id="cancel" type="submit">Cancel</button>
    `;

    // after you've updated the DOM, add the event handlers:
    document.querySelector('#post-form').innerHTML = htmlSnippet;
    document.querySelector('#save').onclick = updatePost;
    document.querySelector('#cancel').onclick = renderPost;
    toggleVisibility('edit');
};

const formatDate = (date) => {
    const options = { 
        weekday: 'long', year: 'numeric', 
        month: 'long', day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options); 
};

// handles what is visible and what is invisible on the page:
const toggleVisibility = (mode) => {
    if (mode === 'view') {
        document.querySelector('#view-post').classList.remove('hide');
        document.querySelector('#menu').classList.remove('hide');
        document.querySelector('#post-form').classList.add('hide');
    } else {
        document.querySelector('#view-post').classList.add('hide');
        document.querySelector('#menu').classList.add('hide');
        document.querySelector('#post-form').classList.remove('hide');
    }
};

const showConfirmation = () => {
    document.querySelector('#confirmation').classList.remove('hide');
    document.querySelector('#confirmation').innerHTML = 'Post successfully saved.';
};

const createComment = (ev) => {
    const data = {
        comment: document.querySelector('#comment').value,
        author: document.querySelector('#author').value,
        post: activePost.id
    };
    console.log(data);
    fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(showConfirmation2);

    // this line overrides the default form functionality:
    ev.preventDefault();
    window.location.reload();
};

const showConfirmation2 = (data) => {
    console.log('response from the server:', data);
    if (data.message && data.id) {
        document.querySelector('#post-form').classList.toggle("hide");
        document.querySelector('#confirmation').classList.toggle("hide");
    }
};

// called when the page loads:
const initializePage = () => {
    // get the post and comments from the server:
    getPost();
    getComments();
    // add button event handler (right-hand corner:
    document.querySelector('#edit-button').onclick = renderForm;
    document.querySelector('#delete-button').onclick = deletePost;
    document.querySelector('#save_com').onclick = createComment;
    document.querySelector('#cancel_com').onclick = renderPost;
};

initializePage();
