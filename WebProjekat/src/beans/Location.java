package beans;

public class Location {

	private double latitude;
	private double longitude;
	private Address address; // ulica i broj, mesto/grad, poštanski broj
	
	public Location() {
	
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latutude) {
		this.latitude = latutude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}
}
