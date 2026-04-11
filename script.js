  // ========== ENHANCED COMMENTS WITH REPLIES ==========
    function addComment(text) {
        if (!currentRecipe || !loggedIn || !user) return;
        const key = currentRecipe.category + '_' + currentRecipe.name;
        if (!comments[key]) comments[key] = [];
        comments[key].unshift({
            id: Date.now(),
            author: user.name,
            authorInitial: user.name.charAt(0).toUpperCase(),
            text: text,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            likes: 0,
            likedBy: [],
            replies: []
        });
        saveComments();
        updateCommentsUI();
        showNotif('Comment added!');
    }

    function updateCommentsUI() {
        if (!currentRecipe) return;
        
        const key = currentRecipe.category + '_' + currentRecipe.name;
        const list = comments[key] || [];
        commentCount.textContent = list.length + ' comment' + (list.length !== 1 ? 's' : '');
        
        if (list.length === 0) {
            commentsDiv.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your experience!</div>';
        } else {
            let html = '';
            list.forEach(c => {
                const userLiked = loggedIn && user && c.likedBy && c.likedBy.includes(user.name);
                const likeIcon = userLiked ? 'fas' : 'far';
                const isAdminComment = c.isAdmin || (isAdmin && user && user.name === c.author);

                html += `<div class="comment-item" data-comment-id="${c.id}">
                    <div class="comment-header">
                        <div class="comment-author ${isAdminComment ? 'admin' : ''}">
                            <div class="comment-author-avatar">${c.authorInitial}</div>
                            <span class="comment-author-name">${c.author}</span>
                        </div>
                        <span class="comment-date">${c.date}</span>
                    </div>
                    <div class="comment-text">${c.text}</div>
                    <div class="comment-actions">
                        <button class="comment-action like-comment" onclick="likeComment(${c.id})">
                            <i class="${likeIcon} fa-heart"></i> ${c.likes || 0} Like${c.likes !== 1 ? 's' : ''}
                        </button>
                        ${isAdmin ? `<button class="comment-action reply-comment" onclick="showReplyForm('${key}', ${list.indexOf(c)})"><i class="fas fa-reply"></i> Reply</button>` : ''}
                        ${loggedIn && user && (user.name === c.author || isAdmin) ? `<button class="comment-action delete-comment" onclick="deleteComment(${c.id})"><i class="far fa-trash-alt"></i> Delete</button>` : ''}
                    </div>`;

                if (c.replies && c.replies.length > 0) {
                    html += `<div class="comment-replies">`;
                    c.replies.forEach(reply => {
                        html += `<div class="reply-item">
                            <div class="reply-header">
                                <div class="reply-author">
                                    <i class="fas fa-reply"></i> ${reply.author}
                                </div>
                                <span class="reply-date">${reply.date}</span>
                            </div>
                            <div class="reply-text">${reply.text}</div>
                            ${isAdmin ? `<div class="reply-actions">
                                <button class="reply-action delete" onclick="deleteReply('${key}', ${list.indexOf(c)}, ${c.replies.indexOf(reply)})"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>` : ''}
                        </div>`;
                    });
                    html += `</div>`;
                }

                html += `</div>`;
            });
            commentsDiv.innerHTML = html;
        }
    }

    window.deleteReply = function(recipeKey, commentIndex, replyIndex) {
        if (confirm('Delete this reply?')) {
            comments[recipeKey][commentIndex].replies.splice(replyIndex, 1);
            saveComments();
            updateCommentsUI();
            showNotif('Reply deleted');
        }
    };

    window.likeComment = function(id) {
        if (!currentRecipe) return;
        if (!loggedIn || !user) {
            showNotif('Please sign in to like comments');
            return;
        }

        const key = currentRecipe.category + '_' + currentRecipe.name;
        const comment = comments[key]?.find(c => c.id === id);

        if (comment) {
            if (!comment.likedBy) {
                comment.likedBy = [];
            }

            const userIndex = comment.likedBy.indexOf(user.name);

            if (userIndex === -1) {
                comment.likedBy.push(user.name);
                comment.likes++;
                showNotif('Liked!');
            } else {
                comment.likedBy.splice(userIndex, 1);
                comment.likes--;
                showNotif('Like removed');
            }

            saveComments();
            updateCommentsUI();
        }
    };

    window.deleteComment = function(id) {
        if (!currentRecipe) return;
        const key = currentRecipe.category + '_' + currentRecipe.name;
        if (comments[key]) {
            comments[key] = comments[key].filter(c => c.id !== id);
            if (comments[key].length === 0) {
                delete comments[key];
            }
            saveComments();
            updateCommentsUI();
            showNotif('Comment deleted.');
        }
    };
