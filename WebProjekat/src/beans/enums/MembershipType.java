package beans.enums;

import com.google.gson.annotations.SerializedName;

public enum MembershipType {
	@SerializedName("Godišnje")
	Yearly,
	@SerializedName("Mesečno")
	Monthly
}
