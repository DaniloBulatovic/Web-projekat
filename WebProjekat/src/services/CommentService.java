package services;

import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.Comment;
import beans.Comments;

public class CommentService {
	
	private Comments comments = new Comments();
	
	public Collection<Comment> getComments() {
		return comments.getValues();
	}
	
	public Collection<Comment> getCommentsByVenue(String id){
		return comments.getValues().stream().filter(comment -> comment.getSportsVenue().getId().equals(id)).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Comment getComment(String id) {
		return comments.getComment(id);
	}
	
	public void addComment(Comment comment) {
		comments.addComment(comment);
	}

	public void editComment(String id, Comment comment) {
		comments.edit(id, comment);
	}

	public void deleteComment(String id) {
		comments.delete(id);
	}
}
