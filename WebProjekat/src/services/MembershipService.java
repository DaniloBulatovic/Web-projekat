package services;

import java.util.Collection;

import beans.Membership;
import repository.Memberships;

public class MembershipService {
	
	private Memberships memberships = new Memberships();
	
	public Collection<Membership> getMemberships() {
		return memberships.getValues();
	}
	
	public Membership getMembership(String id) {
		return memberships.getMembership(id);
	}
	
	public void addMembership(Membership membership) {
		memberships.addMembership(membership);
	}

	public void editMembership(String id, Membership membership) {
		memberships.edit(id, membership);
	}

	public void deleteMembership(String id) {
		memberships.delete(id);
	}
}
