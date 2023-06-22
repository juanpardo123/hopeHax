let comments = [];

// Function to add a new comment
function addComment(event) {
  event.preventDefault();
  let commentInput = document.getElementById('commentInput');
  let newComment = commentInput.value;

  if (newComment.trim() !== '') {
    comments.push(newComment);
    displayComments();
    commentInput.value = '';
  }
}

// Function to display comments
function displayComments() {
  let commentContainer = document.getElementById('commentContainer');
  commentContainer.innerHTML = '';

  comments.forEach(function(comment) {
    let commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.textContent = comment;
    commentContainer.appendChild(commentElement);
  });
}

// Event listener for the form submit
document.getElementById('commentForm').addEventListener('submit', addComment);