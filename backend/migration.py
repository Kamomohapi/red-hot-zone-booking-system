from config.config import salonCollection

old_prefix = "http://localhost:3000"
new_prefix = "https://red-hot-zone-booking-system-1.onrender.com"

matches = list(salonCollection.find({"website": {"$regex": f"^{old_prefix}"}}))
print(f"Found {len(matches)} salons to update.")

for salon in matches:
    old_website = salon["website"]
    new_website = old_website.replace(old_prefix, new_prefix)
    salonCollection.update_one(
        {"_id": salon["_id"]},
        {"$set": {"website": new_website}}
    )
    print(f"Updated: {old_website} -> {new_website}")