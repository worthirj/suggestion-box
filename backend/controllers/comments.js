
const addComment = db => (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;
  db.transaction(trx => {
    trx('posts')
      .where('post_id', '=', postId)
      .increment('num_comments', 1)
      .then(() => {
        return trx('comments')
          .insert({
            user_id: userId,
            post_id: postId,
            content: content,
            time_posted: new Date()
          })
          .returning('*')
          .then(comment => {
            res.json(comment[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to create comment'));
}

const getCommentsByPost = db => (req, res) => {
  const postId = req.params.postId;
  db.select('*')
    .from('comments')
    .where('post_id', '=', postId)
    .then(comments => {
      res.json(comments)
    })
    .catch(err => res.status(400).json('error getting comments'));
}

module.exports = {
  getCommentsByPost: getCommentsByPost,
  addComment: addComment
}
