package beans.enums;

import com.google.gson.annotations.SerializedName;

public enum VenueType {
	@SerializedName("Teretana")
	Gym,
	@SerializedName("Bazen")
	Pool,
	@SerializedName("Sportski centar")
	SportsCenter,
	@SerializedName("Plesni studio")
	DanceStudio
}
