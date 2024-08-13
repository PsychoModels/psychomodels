from allauth.headless.adapter import DefaultHeadlessAdapter


class MemberAllauthHeadlessAdapter(DefaultHeadlessAdapter):
    def serialize_user(self, user):

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "country": str(user.country) if user.country.code is not None else None,
            "university": user.university,
            "department": user.department,
        }

        return user_data
