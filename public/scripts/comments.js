const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form"); //#comments-form이라는 section안에 있는 form
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentsList(comments) {
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");

    commentElement.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>
    `;
    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommentsForPost(event) {
  const postId = loadCommentsBtnElement.dataset.postid;
  try {
      const response = await fetch(`/posts/${postId}/comments`); //router get요청 blog.js 117
    
      if (!response.ok) {
        alert('Fetching comments failed!');
        return;
      }
      const responseData = await response.json(); //router에서 json형식으로 보낸 댓글 데이터를 다시 풀어냄.
    
      if (responseData && responseData.length > 0) {
        const commentsListElement = createCommentsList(responseData);
        commentsSectionElement.innerHTML = "";
        commentsSectionElement.appendChild(commentsListElement);
      } else {
        commentsSectionElement.firstElementChild.textContent =
          "We could not find any comments. Maybe add one?";
      }
  } catch(error) {
    alert('Getting comments failed!');
  }
}

async function saveComment(event) {
  event.preventDefault(); // form의 기본 submit요청을 무시
  const postId = commentsFormElement.dataset.postid;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = { title: enteredTitle, text: enteredText };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "post",
      body: JSON.stringify(comment),
      // parse = json을 자바스크립트값으로, strigify = 자바스크립트값을 json으로

      // post로 전해지는 데이터를 json이라고 명명하여 app.js에서 미들웨어 express.json을 이용하도록
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchCommentsForPost();
    } else {
      alert("Could not send comment!");
    }

  } catch (error) {
    alert('Could not send request - maybe try again later!');
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
