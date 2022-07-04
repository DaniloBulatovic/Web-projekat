package services;

import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.User;
import beans.Users;
import beans.enums.Role;

public class UserService {
	
	private Users users = new Users();
	
	public Collection<User> getUsers() {
		return users.getValues();
	}
	
	public User getUser(String id) {
		return users.getUser(id);
	}
	
	public Collection<User> getAvailableManagers(){
		return users.getValues().stream().filter(user -> user.getSportsVenue() == null && (user.getRole().equals(Role.Manager) || user.getRole().equals("Menadžer"))).collect(Collectors.toCollection(HashSet::new));
	}
	
	public void addUser(User user) {
		users.addUser(user);
	}

	public void editUser(String id, User user) {
		users.edit(id, user);
	}

	public void deleteUser(String id) {
		users.delete(id);
	}
}
