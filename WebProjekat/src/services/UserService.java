package services;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.Memberships;
import beans.User;
import beans.Users;
import beans.enums.Role;

public class UserService {
	
	private Users users = new Users();
	private Memberships memberships = new Memberships();
	
	public Collection<User> getUsers() {
		Collection<User> allUsers = users.getValues();
		for(User user : allUsers) {
			if (user.getMembership() != null) {
				if (user.getMembership().getExpirationDate().isBefore(LocalDateTime.now())) {
					String membershipId = user.getMembership().getId();
					int currentPoints = user.getPoints();
					int usedAppointments = memberships.getMembership(membershipId).getNumberOfAppointments() - user.getMembership().getNumberOfAppointments();
					
					if(user.getMembership().getNumberOfAppointments() > (memberships.getMembership(membershipId).getNumberOfAppointments() * 2 / 3)) {
						user.setPoints((int) (currentPoints - (user.getMembership().getPrice()/1000 * 532)));
						if(user.getPoints() < 0)
							user.setPoints(0);
					}else {
						user.setPoints((int) (currentPoints + (user.getMembership().getPrice()/1000 * (usedAppointments))));
						if (user.getPoints() > user.getCustomerType().getRequiredPoints()) {
							user.setCustomerType(user.getCustomerType().upgradeType(user.getCustomerType().getTypeName()));
						}
						user.setCustomerType(user.getCustomerType().downgradeType(user.getCustomerType().getTypeName(), user.getPoints()));
					}
					user.setMembership(null);
					try {
						users.writeUsers();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}
		return allUsers;
	}
	
	public User getUser(String id) {
		User user = users.getUser(id);
		if (user.getMembership() != null) {
			if (user.getMembership().getExpirationDate().isBefore(LocalDateTime.now())) {
				String membershipId = user.getMembership().getId();
				int currentPoints = user.getPoints();
				int usedAppointments = memberships.getMembership(membershipId).getNumberOfAppointments() - user.getMembership().getNumberOfAppointments();
				
				if(user.getMembership().getNumberOfAppointments() > (memberships.getMembership(membershipId).getNumberOfAppointments() * 2 / 3)) {
					user.setPoints((int) (currentPoints - (user.getMembership().getPrice()/1000 * 532)));
					if(user.getPoints() < 0)
						user.setPoints(0);
				}else {
					user.setPoints((int) (currentPoints + (user.getMembership().getPrice()/1000 * (usedAppointments))));
					if (user.getPoints() > user.getCustomerType().getRequiredPoints()) {
						user.setCustomerType(user.getCustomerType().upgradeType(user.getCustomerType().getTypeName()));
					}
					user.setCustomerType(user.getCustomerType().downgradeType(user.getCustomerType().getTypeName(), user.getPoints()));
				}
				user.setMembership(null);
				try {
					users.writeUsers();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return user;
	}
	
	public Collection<User> getAvailableManagers(){
		return users.getValues().stream().filter(user -> user.getSportsVenue() == null && (user.getRole().equals(Role.Manager) || user.getRole().equals("Menadžer"))).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<User> getTrainers(){
		return users.getValues().stream().filter(user -> (user.getRole().equals(Role.Trainer) || user.getRole().equals("Trener"))).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<User> getUsersByVenue(String id){
		return users.getValues().stream().filter(user -> (user.getVisitedVenues() == null) ? false : user.getVisitedVenues().stream().anyMatch(venue -> venue.getId().equals(id))).collect(Collectors.toCollection(HashSet::new));
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
