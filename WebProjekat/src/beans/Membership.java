package beans;

import java.time.LocalDate;

import beans.enums.MembershipType;

public class Membership {
	
	private int id;
	private MembershipType type;
	private LocalDate dateOfPaying;
	private LocalDate expirationDate;
	private double price;
	private User customer;
	private boolean isActive;
	private int numberOfAppointments;
	
	public Membership() {
	
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public MembershipType getType() {
		return type;
	}

	public void setType(MembershipType type) {
		this.type = type;
	}

	public LocalDate getDateOfPaying() {
		return dateOfPaying;
	}

	public void setDateOfPaying(LocalDate dateOfPaying) {
		this.dateOfPaying = dateOfPaying;
	}

	public LocalDate getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(LocalDate expirationDate) {
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
}
