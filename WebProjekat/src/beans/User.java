package beans;

import java.time.LocalDate;
import java.util.List;

import beans.enums.Gender;
import beans.enums.Role;

public class User {
	
	private String id;
	private String username;
	private String password;
	private String name;
	private String surname;
	private Gender gender;
	private LocalDate dateOfBirth;
	private Role role;
	//Trainer
	private List<TrainingHistory> trainingHistory;
	// Manager
	private SportsVenue sportsVenue;
	// Customer
	private Membership membership;
	private List<SportsVenue> visitedVenues;
	private int points;
	private CustomerType customerType;
	private boolean isDeleted;
	
	public User() {
	
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public List<TrainingHistory> getTrainingHistory() {
		return trainingHistory;
	}

	public void setTrainingHistory(List<TrainingHistory> trainingHistory) {
		this.trainingHistory = trainingHistory;
	}

	public SportsVenue getSportsVenue() {
		return sportsVenue;
	}

	public void setSportsVenue(SportsVenue sportsVenue) {
		this.sportsVenue = sportsVenue;
	}

	public Membership getMembership() {
		return membership;
	}

	public void setMembership(Membership membership) {
		this.membership = membership;
	}

	public List<SportsVenue> getVisitedVenues() {
		return visitedVenues;
	}

	public void setVisitedVenues(List<SportsVenue> visitedVenues) {
		this.visitedVenues = visitedVenues;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public CustomerType getCustomerType() {
		return customerType;
	}

	public void setCustomerType(CustomerType customerType) {
		this.customerType = customerType;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
}
