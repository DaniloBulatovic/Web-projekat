package services;

import java.util.Collection;

import beans.User;
import beans.Users;

public class UserService {
	
	private Users users = new Users();
	
	public Collection<User> getUsers() {
		return users.getValues();
	}
	
	public User getUser(String id) {
		return users.getUser(id);
	}
	
	public void addUser(User product) {
		users.addUser(product);
	}

	public void editUser(String id, User user) {
		users.edit(id, user);
	}

	public void deleteUser(String id) {
		users.delete(id);
	}
}
