package beans;

import java.time.LocalDateTime;

import beans.enums.MembershipType;

public class Membership {
	
	private String id;
	private MembershipType type;
	private LocalDateTime dateOfPaying;
	private LocalDateTime expirationDate;
	private double price;
	private User customer;
	private boolean isActive;
	private int numberOfAppointments;
	private boolean isDeleted;
	
	public Membership() {
	
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public MembershipType getType() {
		return type;
	}

	public void setType(MembershipType type) {
		this.type = type;
	}

	public LocalDateTime getDateOfPaying() {
		return dateOfPaying;
	}

	public void setDateOfPaying(LocalDateTime dateOfPaying) {
		this.dateOfPaying = dateOfPaying;
	}

	public LocalDateTime getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(LocalDateTime expirationDate) {
		this.expirationDate = expirationDate;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public int getNumberOfAppointments() {
		return numberOfAppointments;
	}

	public void setNumberOfAppointments(int numberOfAppointments) {
		this.numberOfAppointments = numberOfAppointments;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
}
