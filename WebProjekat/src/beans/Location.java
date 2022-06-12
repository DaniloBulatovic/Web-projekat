package beans;

public class Location {

	private double latutude;
	private double longitude;
	private String address; // ulica i broj, mesto/grad, poštanski broj
	
	public Location() {
	
	}

	public double getLatutude() {
		return latutude;
	}

	public void setLatutude(double latutude) {
		this.latutude = latutude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
